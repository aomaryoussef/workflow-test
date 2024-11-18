import structlog

from src.services.lms import Lms
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.domain.partner.repository.repository_bank_account_interface import BankAccountRepositoryInterface
from src.domain.partner.dtos.retrieve_partner_transaction_details_dtos import InputDto, OutputDto
from src.utils.exceptions import NotFoundException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="retrieve partner transaction details")


class RetrieveTransactionDetailsUseCase:
    def __init__(
        self,
        checkout_basket_repository: CheckoutBasketRepositoryInterface,
        user_profile_repository: UserProfileRepositoryInterface,
        bank_account_repository: BankAccountRepositoryInterface,
        input_dto: InputDto,
    ):
        self.checkout_basket_repository = checkout_basket_repository
        self.user_profile_repository = user_profile_repository
        self.bank_account_repository = bank_account_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        checkout_basket = self.checkout_basket_repository.find_by_basket_id(self.input_dto.transaction_id)
        if checkout_basket is None:
            raise NotFoundException("checkout basket not found")
        cashier = self.user_profile_repository.get(checkout_basket.cashier_id)
        bank_account = self.bank_account_repository.get_by_partner_id(self.input_dto.partner_id)
        payment_status = "ERROR"
        transaction = OutputDto(
            consumer_id=checkout_basket.consumer_id,
            transaction_id=checkout_basket.id,
            transaction_date=checkout_basket.created_at,
            workflow_id=checkout_basket.workflow_id,
            bank_name=bank_account.bank_name.value,
            bank_account_number=bank_account.account_number,
            name=checkout_basket.products[0]["name"],
            cashier_name=cashier.first_name + " " + cashier.last_name,
            loan_id=checkout_basket.loan_id,
            status=payment_status,
        )
        selected_commercial_offer = None
        if checkout_basket.commercial_offers is not None:
            selected_commercial_offer = next(
                (
                    offer
                    for offer in checkout_basket.commercial_offers
                    if offer["id"] == str(checkout_basket.selected_commercial_offer_id)
                ),
                None,
            )

        if selected_commercial_offer is not None:
            transaction.amount_financed = selected_commercial_offer["financed_amount"]["units"] / 100
        else:
            transaction.amount_financed = 0

        if selected_commercial_offer is not None:
            transaction.down_payment = selected_commercial_offer["down_payment"]["units"] / 100
        else:
            transaction.down_payment = 0

        if selected_commercial_offer is not None:
            transaction.admin_fees = selected_commercial_offer["admin_fee"]["units"] / 100
        else:
            transaction.admin_fees = 0

        if selected_commercial_offer is not None:
            transaction.amount_collected = selected_commercial_offer["down_payment"]["units"] / 100
        else:
            transaction.amount_collected = 0 + selected_commercial_offer["admin_fee"]["units"] / 100
        if transaction.loan_id is not None:
            transaction_loan = Lms.GetPartnerLoans(
                partner_id=self.input_dto.partner_id, loans=[str(transaction.loan_id)]
            )
            if transaction_loan is not None:
                transaction.status = transaction_loan.loans[0].payment_status
        transaction.transferred_amount = (
            selected_commercial_offer["financed_amount"]["units"] / 100 if payment_status == "PAID" else 0
        )
        return transaction
