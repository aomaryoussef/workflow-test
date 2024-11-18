from typing import List
from src.domain.consumer.dtos.get_consumer_loans_dto import GetConsumerLoansOutputDto, Loan
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.services.lms import Lms
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="get consumer loan detail")


class GetConsumerLoanDetailsUseCase:
    def __init__(
        self,
        consumer_repository: ConsumerRepositoryInterface,
        partner_repository: PartnerRepositoryInterface,
        consumer_id: str,
        loan_id: str,
        installment_id: int,
    ):
        self.consumer_repository = consumer_repository
        self.partner_repository = partner_repository
        self.consumer_id = consumer_id
        self.loan_id = loan_id
        self.installment_id = installment_id

    def execute(self) -> [GetConsumerLoansOutputDto]:
        logger.debug("execute")
        try:
            consumer = self.consumer_repository.get(self.consumer_id)
            if not consumer:
                logger.debug("consumer not found")
                return GetConsumerLoansOutputDto([], self.consumer_id)
            logger.debug("consumer found")
            consumer_loans = Lms.GetConsumerLoans(self.consumer_id)
            if consumer_loans is None:
                return GetConsumerLoansOutputDto([], self.consumer_id)
            consumer_loans.loans = self.__get_loan_by_id(consumer_loans.loans)
            partner_ids = self.__get_partner_ids(consumer_loans.loans)
            partners = self.partner_repository.get_names_by_ids(set(partner_ids))
            if not partners:
                raise Exception("Partners not found in the database")
            partners_by_id = self.__partners_names_by_id(partners)
            consumer_loans.loans = self.__set_partner_names(partners_by_id, consumer_loans.loans)
            return consumer_loans
        except Exception as exception:
            logger.error("Failed to get consumer loans %s" % str(exception))
            raise exception

    def __get_partner_ids(self, loans: List[Loan]) -> List[str]:
        partner_ids = []
        for loan in loans:
            partner_ids.append(str(loan.partner_id))
        return partner_ids

    def __partners_names_by_id(self, partners):
        partners_by_id = {}
        for partner in partners:
            partner_id = str(partner[1])
            partners_by_id[partner_id] = partner[0]
        return partners_by_id

    def __set_partner_names(self, partners_by_id, loans: List[Loan]) -> List[Loan]:
        for loan in loans:
            partner_name = partners_by_id.get(str(loan.partner_id))
            loan.partner_name = partner_name
        return loans

    def __get_loan_by_id(self, loans: List[Loan]) -> List[Loan]:
        loanDetails = list(filter(lambda loan: str(loan.loan_id) == self.loan_id, loans))
        if len(loanDetails) > 0:
            loanDetails[0].payment_schedule = list(
                filter(lambda payment: payment.installment_id == self.installment_id, loanDetails[0].payment_schedule)
            )
        return loanDetails
