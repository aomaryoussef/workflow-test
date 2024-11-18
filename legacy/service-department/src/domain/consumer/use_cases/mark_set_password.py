from src.services.logging import logger
from src.utils.kratos import Kratos
from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)

from src.domain.consumer.dtos.mark_set_password_dtos import InputDto, OutputDto

logger = logger.bind(service="consumer", context="use case", action="mark set password")


class MarkSetPasswordUseCase:
    def __init__(self, repo: ConsumerRepositoryInterface, input_dto: InputDto):
        self.iam = Kratos
        self.repo = repo
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        logger.debug(self.input_dto)
        try:
            consumer = self.repo.get_by_iam_id(self.input_dto.iam_id)
            output_dto = OutputDto()
            if consumer is None:
                logger.error("Consumer not found in database")
                output_dto.success = False
            else:
                output_dto.success = self.iam.set_identity_password_created(self.input_dto.iam_id, True)

            return output_dto
        except Exception as expt:
            logger.error("Failed to mark password in identity: {}".format(str(expt)))
            output_dto = OutputDto(False)
            return output_dto
