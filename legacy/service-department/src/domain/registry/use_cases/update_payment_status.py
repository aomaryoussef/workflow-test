from src.services.logging import logger
from src.domain.registry.repository.payment_repo_interface import PaymentRepoInterface
from src.domain.registry.dtos.update_payment_dtos import InputDto, OutputDto
from src.utils.exceptions import ResourceNotUpdatedException

logger = logger.bind(service="registry", context="use case", action="update payment status")


class UpdatePaymentStatusUseCase:
    def __init__(self, repository: PaymentRepoInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        updated_payment = self.repository.update(id=self.input_dto.id, status=self.input_dto.status)
        if updated_payment is None:
            raise ResourceNotUpdatedException("Unable to update payment status in DB")
        logger.debug("Payment status updated successfully with id {}".format(updated_payment.id))
        output_dto: OutputDto = OutputDto(payment=updated_payment)
        return output_dto
