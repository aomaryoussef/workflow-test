from src.domain.partner.dtos.get_partner_loans_dto import GetPartnerLoansOutputDto, PartnerLoan
import requests
from config.settings import settings
from src.domain.consumer.dtos.get_consumer_loans_dto import GetConsumerLoansOutputDto, Loan, LoanInstallment, LoanStatus
from src.services.logging import logger

lms_url = settings.get("lms", default={}).get("base_url", default="")

logger = logger.bind(service="lms", context="setup", action="setup")


class Lms:
    @staticmethod
    def _consumer_loans_json_to_dto(consumer_loans, consumer_id) -> [GetConsumerLoansOutputDto]:
        try:
            json_loans = consumer_loans["data"]["loans"]
            loans = []
            if json_loans is not None:
                for json_loan in json_loans:
                    installments = []
                    for loan_installment in json_loan["payment_schedule"]:
                        loan_installment_dto = LoanInstallment(
                            instalment_due_date=loan_installment["due_date"],
                            paid_date=loan_installment["paid_date"],
                            principal_due=loan_installment["principal_due"],
                            interest_due=loan_installment["interest_due"],
                            late_fee_due=loan_installment["late_fee_due"],
                            grace_period_end_date=loan_installment["grace_period_end_date"],
                            paid_principal=loan_installment["paid_principal"],
                            paid_interest=loan_installment["paid_interest"],
                            paid_late_fee=loan_installment["paid_late_fee"],
                            installment_id=loan_installment["id"],
                            is_cancelled=loan_installment["is_cancelled"]
                        )
                        installments.append(loan_installment_dto)
                    loan = Loan(
                        loan_id=json_loan["loan_id"],
                        partner_id=json_loan["merchant_id"],
                        partner_name="",
                        admin_fee=json_loan["admin_fee"],
                        current_status=LoanStatus(**json_loan["current_status"]),
                        booked_at=json_loan["booked_at"],
                        payment_schedule=installments,
                        early_settlement_details=json_loan["early_settlement_details"],
                    )
                    loans.append(loan)
            dto = GetConsumerLoansOutputDto(loans, consumer_id)
            return dto
        except Exception as exception:
            logger.error("Failed to load loan json into dto %s" % exception)
            return None

    @staticmethod
    def _partner_loans_json_to_dto(partner_loans) -> [GetPartnerLoansOutputDto]:
        try:
            json_loans = partner_loans["data"]["loans"]
            loans = []
            if json_loans is not None:
                for json_loan in json_loans:
                    loan = PartnerLoan(
                        loan_id=json_loan["loan_id"],
                        correlation_id=json_loan["correlation_id"],
                        consumer_id=json_loan["consumer_id"],
                        partner_id=json_loan["merchant_id"],
                        financial_product_key=json_loan["financial_product_key"],
                        financial_product_version=json_loan["financial_product_version"],
                        created_at=json_loan["created_at"],
                        admin_fee=json_loan["admin_fee"],
                        current_status=LoanStatus(**json_loan["current_status"]),
                        booked_at=json_loan["booked_at"],
                        created_by=json_loan["created_by"],
                        transaction_status=json_loan["transaction_status"],
                        transaction_id=json_loan["transaction_id"],
                        payment_status=json_loan["payment_status"],
                    )
                    loans.append(loan)
            dto = GetPartnerLoansOutputDto(loans)

            return dto
        except Exception as exception:
            logger.error("Failed to load loan json into dto %s" % exception)
            return None

    @staticmethod
    def GetConsumerLoans(consumer_id: str) -> [GetConsumerLoansOutputDto]:
        try:
            response = requests.get(
                url=lms_url + "/api/loans/consumer/" + consumer_id,
                verify=False,
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                loans = response.json()
                return Lms._consumer_loans_json_to_dto(loans, consumer_id)
            else:
                logger.debug("Failed to get consumer loans from LMS %s" % str(response))
                return None
        except Exception as exception:
            logger.error("Failed to get consumer loans %s" % str(exception))
            raise exception

    @staticmethod
    def GetPartnerLoans(partner_id: str, loans: [str] = []) -> [GetPartnerLoansOutputDto]:
        try:
            logger.debug("start get partner loans from LMS ")
            url = lms_url + "/api/loans/merchant/" + str(partner_id)
            if len(loans) > 0:
                url = url + "?loans=" + ",".join(loans)
            response = requests.get(
                url=url,
                verify=True,
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                loans = response.json()
                return Lms._partner_loans_json_to_dto(loans)
            else:
                logger.debug("Failed to get partner loans from LMS %s" % str(response))
                return None
        except Exception as exception:
            logger.error("Failed to get partner loans %s" % str(exception))
            raise exception
