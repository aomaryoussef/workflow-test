import time
from asyncio import Future
from typing import List, Dict, Any
from .models import Loan, LoanStatus
import util.logger as logger
from . import storage
from . import lmc_v2_client
from . import journal
import concurrent.futures
from . import manual_overwrites
import pandas as pd

def __generate_dynamics_merchant_id(party_account_id: int) -> str:
    return f"MERCH-{party_account_id:010d}"

def __load_all_loans_lms_v1() -> List[Loan]:
    existing_loans = storage.load_all_loans_lms_v1()
    existing_loan_statuses = storage.load_all_loan_status_lms_v1()
    existing_checkout_baskets = storage.load_all_valid_checkout_baskets()

    # Create a dictionary to map loan_id to LoanStatus objects
    loan_status_map: Dict[str, List[LoanStatus]] = {}
    for loan_status in existing_loan_statuses:
        loan_id, status, created_at = loan_status
        if loan_id not in loan_status_map:
            loan_status_map[loan_id] = [LoanStatus(status, created_at)]
        loan_status_map[loan_id].append(LoanStatus(status, created_at))

    loan_objects_map: Dict[str, Loan] = {}
    for loan in existing_loans:
        loan_id, financial_product_key, financial_product_version, booked_at, consumer_id, merchant_global_id, commercial_offer_id, merchant_code, origination_amount  = loan
        statuses = loan_status_map.get(loan_id)
        loan_obj = Loan(
            id=loan_id,
            financial_product_key=financial_product_key,
            financial_product_version=financial_product_version,
            booked_at=booked_at,
            consumer_id=consumer_id,
            merchant_global_id=merchant_global_id,
            commercial_offer_id=commercial_offer_id,
            statuses=statuses,
            ## In v1 when pulling origination amount refers to the actual financed amount
            ## In v2 Origination Amount is the basket value
            ## We will add the down-payment to this origination amount later in this code
            origination_amount=origination_amount,
            merchant_code=__generate_dynamics_merchant_id(merchant_code),
            # to be added later
            tenor_key="",
            consumer_repayment_day_of_month=0,
            down_payment_amount=0,
        )
        loan_objects_map[loan_id] = loan_obj

    for basket in existing_checkout_baskets:
        loan_id, selected_tenure, down_payment_amount, single_payment_day = basket
        existing_loan = loan_objects_map.get(loan_id)
        if existing_loan is None:
            err_msg = f"for loan id: {loan_id} in checkout basket, no loans in LMS exist"
            logger.error(err_msg)
            continue
        existing_loan.tenor_key = selected_tenure
        existing_loan.consumer_repayment_day_of_month = single_payment_day
        # add the downpayment to the origination
        existing_loan.origination_amount += down_payment_amount
        existing_loan.down_payment_amount = down_payment_amount
        loan_objects_map[loan_id] = existing_loan

    return list(loan_objects_map.values())

def __group_loans_by_consumer(existing_loans: List[Loan]) -> Dict[str, List[Loan]]:
    # Group loans by consumer_id
    loans_by_consumer: Dict[str, List[Loan]] = {}
    for loan in existing_loans:
        consumer_id = loan.consumer_id
        if consumer_id not in loans_by_consumer:
            loans_by_consumer[consumer_id] = []

        loans_by_consumer[consumer_id].append(loan)

    # Verify after grouping if the total loans match
    total_loans_grouped = 0
    for consumer_id, loans in loans_by_consumer.items():
        total_loans_grouped = total_loans_grouped + len(loans)

    if total_loans_grouped != len(existing_loans):
        err_msg = f"loans count do not match - total loaded: {len(existing_loans)} vs total grouped: {total_loans_grouped}"
        logger.error(err_msg)
        raise Exception(err_msg)

    return loans_by_consumer

def __activate_loans_for_consumer(loan_list: List[Loan]):
    for l in loan_list:
        lmc_v2_client.activate_loan_lms_v2(l)
        # logger.info(f"activated loan with id: {l.id} - for consumer: {l.consumer_id}")

def __create_loans_for_consumer(loan_list: List[Loan]):
    for l in loan_list:
        lmc_v2_client.create_loan_lms_v2(l)
        # logger.info(f"created loan with id: {l.id} - for consumer: {l.consumer_id}")

def __cancel_loan(cancelled_loans: List[Any]):
    for l in cancelled_loans:
        loan_id, cancelled_at_utc = l
        lmc_v2_client.cancel_loan_lms_v2(loan_id, cancelled_at_utc)

def __execute_cmd_async(loans_by_consumer: Dict[str, List[Loan]], fn: Any) -> Dict[str, List[Future]]:
    futures: Dict[str, List[Future]] = {}
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for consumer_id, loans in loans_by_consumer.items():
            futures[consumer_id] = []
            future = executor.submit(fn, loans)
            futures[consumer_id].append(future)

    return futures

def __wait_for_futures(futures: Dict[str, List[Future]], action: str):
    counter_map: Dict[str, int] = {}
    for consumer_id, futures_list in futures.items():
        counter_map[consumer_id] = 0
        for future in concurrent.futures.as_completed(futures_list):
            try:
                future.result()  # This will re-raise any exceptions caught during the execution
                counter_map[consumer_id] += 1
            except Exception as e:
                logger.error(f"error {action} loans for consumer {consumer_id}: {e}")
                return

        #logger.info(f"for consumer: {consumer_id} total loans {action}: {counter_map[consumer_id]}")

def __wait_for_river_jobs_to_complete(filter: str = "state <> 'completed'", secs: int = 1):
    while True:
        count = storage.count_river_queue_jobs_with_filter_condition(filter)
        if count == 0:
            break
        else:
            logger.info(f"waiting for {secs} secs. incomplete river jobs: {count}")
            time.sleep(secs)

def run():
    existing_loans = __load_all_loans_lms_v1()
    logger.info(f"total loans loaded from V1: {len(existing_loans)}")
    loans_by_consumer = __group_loans_by_consumer(existing_loans)
    logger.info(f"distributed and grouped loans into consumer buckets for: {len(loans_by_consumer)} consumers")

    futures = __execute_cmd_async(loans_by_consumer, __create_loans_for_consumer)
    logger.info("wait for all loan creations to complete...")
    __wait_for_futures(futures, "CREATE")
    logger.info("all loans created successfully")
    __wait_for_river_jobs_to_complete(filter="state <> 'completed'", secs=1)

    futures = __execute_cmd_async(loans_by_consumer, __activate_loans_for_consumer)
    logger.info("wait for all loan activations to complete...")
    __wait_for_futures(futures, "ACTIVATE")
    logger.info("all loans activated successfully")
    __wait_for_river_jobs_to_complete(
        filter="state <> 'completed' AND (kind IN ('wm:loan_account:activate', 'wm:loan_account:update_early_settlement_details', 'sl:loan_account:create_posting', 'gl:loan_account:create_posting'))",
        secs=5
    )

    logger.info("manual overwrite the journal values, see: PR https://github.com/btechlabs/mylo/pull/427")
    manual_overwrites.overwrite_journal_admin_fee_post_loan_activations()

    logger.info("journal verifications post loan activation...")
    journal.verify_journals_post_activation_only()

    cancelled_loans = storage.load_all_cancelled_loans_lms_v1()
    logger.info(f"found total cancelled loans: {len(cancelled_loans)}")
    cancelled_loans_dict: Dict[str, List[Any]] = {"all_loans_in_one_list": cancelled_loans}
    futures = __execute_cmd_async(cancelled_loans_dict, __cancel_loan)
    logger.info("wait for all loan cancellations to complete...")
    __wait_for_futures(futures, "CANCEL")
    logger.info("all loans cancelled successfully")
    __wait_for_river_jobs_to_complete(
        filter="state NOT IN ('completed', 'cancelled') AND (kind IN ('wm:loan_account:cancel', 'sl:loan_account:cancel_posting', 'gl:loan_account:cancel_posting'))",
        secs=1
    )

    logger.info("journal verifications post loan cancellations...")
    journal.verify_journals_post_cancellation_only()

    # load all interest accruals from V1
    interest_accruals_v1_df: pd.Dataframe = storage.load_all_journal_v1(filters="type='INTEREST_EARNED' AND account='MurabhaUnearnedRevenue' AND direction='DEBIT'")
    logger.info(f"total interest accruals loaded from V1 (only MurabhaUnearnedRevenue debits): {len(interest_accruals_v1_df)}")
    interest_accruals_v1_df = interest_accruals_v1_df.sort_values(by=['loan_id', 'booked_at'])
    grouped_schedule_counts = interest_accruals_v1_df.groupby('loan_id').size().reset_index(name='schedule_count')
    grouped_schedule_counts_dict = grouped_schedule_counts.set_index('loan_id').to_dict()['schedule_count']
    logger.info("waking up river jobs that were snoozed before for accrual postings...")
    storage.wake_up_river_jobs(grouped_schedule_counts_dict)
    ## Note: There is a bug in V1
    ## The interest earned is not posted correctly in V1
    ## Eg. See the journals for loan '0019628e-9b4f-4c65-9e65-6b23cb77d971'
    ## Even though there is an interest of 29 cents, it is not being recorded in journal.
    journal.verify_journals_post_revenue_recognition_only()



