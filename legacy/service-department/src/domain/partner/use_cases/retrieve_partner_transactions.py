import structlog

from typing import List
from src.services.lms import Lms
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.domain.partner.dtos.retrieve_partner_transaction_details_dtos import (
    OutputDto as RetrievePartnerTransactionDetailsOutputDto,
)
from src.domain.partner.dtos.retrieve_partner_trasnactions_dtos import InputDto, OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="retrieve partner transactions")


class RetrievePartnerTransactionsUseCase:
    def __init__(
        self,
        checkout_basket_repository: CheckoutBasketRepositoryInterface,
        user_profile_repository: UserProfileRepositoryInterface,
        input_dto: InputDto,
    ):
        self.checkout_basket_repository = checkout_basket_repository
        self.user_profile_repository = user_profile_repository
        self.input_dto = input_dto

    def execute(self) -> List:
        logger.debug("execute")
        activated_baskets_statuses = [
            CheckoutBasketStatus.LOAN_ACTIVATED,
        ]
        checkout_baskets = self.checkout_basket_repository.find_all_for_partner_by_statuses(
            partner_id=self.input_dto.partner_id,
            statuses=activated_baskets_statuses,
            limit=self.input_dto.per_page,
            page_number=self.input_dto.page,
        )
        transactions_count = self.checkout_basket_repository.get_checkout_baskets_count(
            partner_id=self.input_dto.partner_id, statuses=activated_baskets_statuses
        )
        transactions = self.__convert_transactions(checkout_baskets)
        output_dto = OutputDto(transactions=transactions, total_count=transactions_count)
        return output_dto

    def __convert_transactions(self, checkout_baskets) -> OutputDto:
        # Flatten products into a single list of transactions
        result = []
        partner_loans = Lms.GetPartnerLoans(
            partner_id=self.input_dto.partner_id,
            loans=[
                str(checkout_basket.loan_id)
                for checkout_basket in checkout_baskets
                if checkout_basket.loan_id is not None
            ],
        )
        if partner_loans is not None:
            partner_loans = partner_loans.loans
        for basket in checkout_baskets:
            cashier = self.user_profile_repository.get(basket.cashier_id)
            cashier_name = cashier.first_name + " " + cashier.last_name if cashier is not None else ""
            selected_commercial_offer = None
            if basket.commercial_offers is not None:
                selected_commercial_offer = next(
                    (
                        offer
                        for offer in basket.commercial_offers
                        if offer["id"] == str(basket.selected_commercial_offer_id)
                    ),
                    None,
                )
            payment_status = "ERROR"
            if basket.loan_id is not None:
                partner_loan = next(
                    partner_loan for partner_loan in partner_loans if partner_loan.loan_id == str(basket.loan_id)
                )
                if partner_loan is not None:
                    payment_status = partner_loan.payment_status
            transaction = {
                "consumer_id": basket.consumer_id,
                "transaction_id": basket.id,
                "transaction_date": basket.created_at,
                "cashier_name": cashier_name,
                "status": payment_status,
                "name": basket.products[0]["name"],
                "workflow_id": basket.workflow_id,
                "loan_id": basket.loan_id,
                "amount_financed": (
                    selected_commercial_offer["financed_amount"]["units"] / 100
                    if selected_commercial_offer is not None
                    else 0
                ),
                "down_payment": (
                    selected_commercial_offer["down_payment"]["units"] / 100
                    if selected_commercial_offer is not None
                    else 0
                ),
                "admin_fees": (
                    selected_commercial_offer["admin_fee"]["units"] / 100
                    if selected_commercial_offer is not None
                    else 0
                ),
                "amount_collected": (
                    selected_commercial_offer["down_payment"]["units"] / 100
                    + selected_commercial_offer["admin_fee"]["units"] / 100
                ),
                "transferred_amount": (
                    selected_commercial_offer["financed_amount"]["units"] / 100 if payment_status == "PAID" else 0
                ),
            }
            result.append(RetrievePartnerTransactionDetailsOutputDto(**transaction))

        return result
