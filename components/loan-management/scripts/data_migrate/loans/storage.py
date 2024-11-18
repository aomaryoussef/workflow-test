import config.db_pool_lms_v1 as db_lms_v1
import config.db_pool_lms_v2 as db_lms_v2
import config.db_pool_mylo as db_mylo
from typing import List
import pandas as pd
import util.logger as logger
from typing import Dict

journal_df_column_types = {
    'loan_id': 'str',
    'booked_at': 'datetime64[ns, UTC]',
    'amount': 'int64',
    'direction': 'str',
    'account': 'str',
}

journal_df_sort_fields = ['loan_id', 'booked_at', 'account', 'direction']

def load_all_loans_lms_v1() -> List[any]:
    lms_v1_conn = db_lms_v1.get_connection()
    lms_v1_cursor = lms_v1_conn.cursor()
    try:
        # Fetch loans
        lms_v1_cursor.execute("""
                    SELECT 
                        l.id AS loan_id, 
                        l.financial_product_key, 
                        l.financial_product_version,
                        l.booked_at,
                        l.consumer_id, 
                        l.merchant_global_id, 
                        l.commercial_offer_id, 
                        pa.id AS merchant_code,
                        j.amount AS origination_amount
                    FROM public.loan l 
                    INNER JOIN public.party_account pa ON l.merchant_global_id = pa.global_reference_id
                    INNER JOIN public.journal j ON l.id = j.loan_id 
                    WHERE j.direction = 'DEBIT' AND j.type = 'PURCHASING_FROM_MERCHANT'
                """)
        loans = lms_v1_cursor.fetchall()
        return loans
    finally:
        lms_v1_cursor.close()
        db_lms_v1.release_connection(lms_v1_conn)

def load_all_cancelled_loans_lms_v1() -> List[any]:
    lms_v1_conn = db_lms_v1.get_connection()
    lms_v1_cursor = lms_v1_conn.cursor()
    try:
        # Fetch loans
        lms_v1_cursor.execute("""
            SELECT 
                l.id AS loan_id
                , cancelled_ls.created_at AS cancelled_at_utc
            FROM loan l
            INNER JOIN loan_status cancelled_ls ON l.id = cancelled_ls.loan_id AND cancelled_ls.status = 'CANCELLED'
        """)
        loans = lms_v1_cursor.fetchall()
        return loans
    finally:
        lms_v1_cursor.close()
        db_lms_v1.release_connection(lms_v1_conn)

def load_all_loan_status_lms_v1() -> List[any]:
    lms_v1_conn = db_lms_v1.get_connection()
    lms_v1_cursor = lms_v1_conn.cursor()
    try:
        lms_v1_cursor.execute("""
                        SELECT loan_id, status, created_at
                        FROM public.loan_status
                    """)
        loan_statuses = lms_v1_cursor.fetchall()
        return loan_statuses
    finally:
        lms_v1_cursor.close()
        db_lms_v1.release_connection(lms_v1_conn)

def load_all_valid_checkout_baskets() -> List[any]:
    db_mylo_conn = db_mylo.get_connection()
    db_mylo_cursor = db_mylo_conn.cursor()
    try:
        db_mylo_cursor.execute("""
                    SELECT 
                        cb.loan_id,
                        (offer.value->>'tenure') AS selected_tenure,
                        (offer.value->'down_payment'->'units')::integer AS down_payment_amount,
                        c.single_payment_day
                    FROM public.checkout_baskets cb
                    JOIN LATERAL (
                        SELECT value
                        FROM jsonb_array_elements(cb.commercial_offers) AS value
                        WHERE cb.commercial_offers IS NOT NULL AND jsonb_typeof(cb.commercial_offers) = 'array'
                    ) AS offer ON offer.value->>'id' = cb.selected_commercial_offer_id::text
                    INNER JOIN public.consumers c on cb.consumer_id = c.id 
                    WHERE cb.status = 'LOAN_ACTIVATED' and cb.loan_id IS NOT NULL
                """)
        baskets = db_mylo_cursor.fetchall()
        return baskets
    finally:
        db_mylo_cursor.close()
        db_mylo.release_connection(db_mylo_conn)

def count_river_queue_jobs_with_filter_condition(filters: str = "TRUE") -> int:
    lms_v2_conn = db_lms_v2.get_connection()
    lms_v2_cursor = lms_v2_conn.cursor()
    try:
        # Fetch loans
        lms_v2_cursor.execute(f"""
            SELECT COUNT(*)
            FROM river_job
            WHERE {filters}
        """)
        result = lms_v2_cursor.fetchone()
        count = result[0] if result else 0
        return count
    finally:
        lms_v2_cursor.close()
        db_lms_v2.release_connection(lms_v2_conn)

def load_all_journal_v1(filters: str or None = None) -> pd.DataFrame:
    lms_v1_conn = db_lms_v1.get_connection()
    lms_v1_cursor = lms_v1_conn.cursor()
    try:
        sql_query = "SELECT loan_id, booked_at, amount, direction, account FROM journal WHERE 1=1"
        if filters not in [None, ""]:
            sql_query += f" AND {filters}"
        # Fetch loans
        lms_v1_cursor.execute(sql_query)
        journals = lms_v1_cursor.fetchall()
        journals_df = pd.DataFrame(journals)
        journals_df.columns = ['loan_id', 'booked_at', 'amount', 'direction', 'account']

        # Explicitly typecast the DataFrame columns to ensure they match
        journals_df = journals_df.astype(journal_df_column_types)
        logger.info("explicit type-casting of the cols in dataframes")

        # Transform the account column in journal_v1
        account_name_replacement = {
            'MurabhaPurchase': 'murabaha_purchase',
            'MerchantDue': 'merchant_due',
            'MurabhaPrincipalReceivable': 'murabaha_loan_receivable',
            'MurabhaInterestReceivable': 'murabaha_interest_receivable',
            'MurabhaUnearnedRevenue': 'unearned_revenue',
            'AdminFeeReceivable': 'admin_fee_receivable',
            'TaxDue': 'vat_receivable',
            'Doubtful': 'doubtful_allowance',
            'DoubtfulReceivable': 'doubtful_allowance_receivable',
            'InterestRevenue': 'interest_revenue',
        }
        journals_df['account'] = (journals_df['account'].replace(account_name_replacement))
        journals_df['booked_at'] = pd.to_datetime(journals_df['booked_at'])
        journals_df['booked_at'] = journals_df['booked_at'].dt.floor('s')
        logger.info("account names renamed for V1 to match account names in V2")

        # Sort the DataFrames to ensure consistent row ordering for comparison
        journals_df = journals_df.sort_values(by=journal_df_sort_fields, ascending=[True, True, True, True]).reset_index(drop=True)
        logger.info(f"sorted the dataframes by fields: {journal_df_sort_fields}")

        return journals_df
    finally:
        lms_v1_cursor.close()
        db_lms_v1.release_connection(lms_v1_conn)

def load_all_journal_v2(filters: str or None = None) -> pd.DataFrame:
    lms_v2_conn = db_lms_v2.get_connection()
    lms_v2_cursor = lms_v2_conn.cursor()
    try:
        sql_query = "SELECT linked_entity_id as loan_id, booked_at, amount, direction, sub_account as account FROM journal WHERE 1=1"
        if filters not in [None, ""]:
            sql_query += f" AND {filters}"
        # Fetch loans
        lms_v2_cursor.execute(sql_query)
        journals = lms_v2_cursor.fetchall()
        journals_df = pd.DataFrame(journals)
        journals_df.columns = ['loan_id', 'booked_at', 'amount', 'direction', 'account']

        # Explicitly typecast the DataFrame columns to ensure they match
        journals_df = journals_df.astype(journal_df_column_types)
        logger.info("explicit type-casting of the cols in dataframes")

        # Sort the DataFrames to ensure consistent row ordering for comparison
        journals_df = journals_df.sort_values(by=journal_df_sort_fields, ascending=[True, True, True, True]).reset_index(drop=True)
        logger.info(f"sorted the dataframes by fields: {journal_df_sort_fields}")

        return journals_df
    finally:
        lms_v2_cursor.close()
        db_lms_v2.release_connection(lms_v2_conn)

def wake_up_river_jobs(loan_schedules: Dict[str, int]):
    count_river_jobs_woken_up = 0
    updated_job_ids = []

    for loan_id, max_schedule in loan_schedules.items():
        lms_v2_conn = db_lms_v2.get_connection()
        lms_v2_cursor = lms_v2_conn.cursor()
        try:
            for schedule_number in range(1, max_schedule + 1):
                sql_query = f"""
                UPDATE river_job 
                SET state = 'available', 
                    scheduled_at = to_timestamp(args->>'booked_at', 'YYYY-MM-DD"T"hh24:mi:ss')::TIMESTAMP WITHOUT TIME ZONE AT TIME ZONE 'UTC', 
                    args = args::jsonb - 'should_snooze' || '{{"should_snooze":false}}'::jsonb
                WHERE state = 'scheduled' 
                  AND args->>'loan_id' = '{loan_id}' 
                  AND (args->>'instalment_schedule_number')::INTEGER = {schedule_number}
                RETURNING id;
                """
                lms_v2_cursor.execute(sql_query)
                updated_ids = lms_v2_cursor.fetchall()
                for row in updated_ids:
                    updated_job_ids.append(row[0])

                count_river_jobs_woken_up += 1
                lms_v2_conn.commit()

                logger.info(f"woke up all river jobs for loan_id: {loan_id}")
        except Exception as e:
            lms_v2_conn.rollback()
            logger.error(f"error waking up river jobs for loan_id: {loan_id} with error: {e}")
        finally:
            lms_v2_cursor.close()
            db_lms_v2.release_connection(lms_v2_conn)

    logger.info(f"total river jobs expected woken up: {count_river_jobs_woken_up} v/s actual woken up: {len(updated_job_ids)}")