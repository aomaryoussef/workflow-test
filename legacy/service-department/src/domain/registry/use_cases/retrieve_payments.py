from src.services.logging import logger
from src.domain.registry.repository.payment_repo_interface import PaymentRepoInterface
from src.domain.registry.dtos.retrieve_payments_dtos import InputDto, OutputDto

logger = logger.bind(service="registry", context="use case", action="retrieve payment")


class RetrievePaymentsUseCase:
    def __init__(self, repository: PaymentRepoInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        payments = self.repository.find_all(
            billing_account=self.input_dto.billing_account,
            billing_account_schedule_id=self.input_dto.billing_account_schedule_id,
        )
        output_dto: OutputDto = OutputDto(payments=payments)
        return output_dto
