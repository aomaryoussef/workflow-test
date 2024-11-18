from src.services.logging import logger
from src.domain.registry.repository.payment_repo_interface import PaymentRepoInterface
from src.domain.registry.dtos.retrieve_payment_dtos import InputDto, OutputDto
from src.utils.exceptions import NotFoundException

logger = logger.bind(service="registry", context="use case", action="retrieve payment")


class RetrievePaymentUseCase:
    def __init__(self, repository: PaymentRepoInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        payment = self.repository.find(self.input_dto.id)
        if payment is None:
            logger.error("Unable to find payment record in DB")
            raise NotFoundException("Unable to find payment record in DB")
        else:
            output_dto: OutputDto = OutputDto(payment=payment)
            return output_dto
