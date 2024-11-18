from src.services.logging import logger
from src.domain.partner.dtos.retrieve_cashier_profile_dtos import InputDto, OutputDto
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.utils.exceptions import NotFoundException

logger = logger.bind(service="partner", context="use case", action="retrieve cashier profile")


class RetrieveCashierProfileUseCase:
    """This class is responsible for retrieve cashier profile."""

    def __init__(self, user_profile_repository: UserProfileRepository, input_dto: InputDto):
        self.user_profile_repository = user_profile_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        cashier = self.user_profile_repository.get_cashier_by_iam(self.input_dto.iam_id)
        if cashier is None:
            logger.error("cashier not found")
            raise NotFoundException("cashier not found")
        output_dto = OutputDto(user_profile=cashier)
        return output_dto
