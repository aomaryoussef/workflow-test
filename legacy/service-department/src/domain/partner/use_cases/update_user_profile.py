import structlog
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.dtos.update_user_profile_dtos import UpdateUserProfileOutputDto

from src.utils.kratos import Kratos

logger = structlog.get_logger()


class UpdateUserProfileUseCase:
    """This class is responsible for update user profile identity."""

    def __init__(self, user_profile_repository: UserProfileRepository):
        self.user_profile_repository = user_profile_repository

    def execute(self, partner_id, user_profile_id, body: dict):
        logger.debug("update user profile identity use case - execute")
        if body.get("state") is not None:
            user_profile = self.user_profile_repository.get(user_profile_id)
            kratos_response = Kratos.update_identity(str(user_profile.iam_id), body.get("state"))
        return UpdateUserProfileOutputDto(result=bool(kratos_response))
