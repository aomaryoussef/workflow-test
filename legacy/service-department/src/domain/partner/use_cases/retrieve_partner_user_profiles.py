import structlog

from typing import List
from src.domain.partner.dtos.retrieve_user_profile_dtos import (
    RetrieveUserProfileOutputDto,
    RetrieveUserProfilesOutputDto,
)
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.utils.kratos import Kratos

logger = structlog.get_logger()


class RetrievePartnerUserProfilesUseCase:
    """This class is responsible for retrieve all user profiles."""

    def __init__(self, user_profile_repository: UserProfileRepository):
        self.user_profile_repository = user_profile_repository

    def execute(self, iam_id, partner_id, type, page, per_page) -> List[RetrieveUserProfileOutputDto]:
        logger.debug("retrieve all user profiles use case - execute")
        user_profiles = []
        user_profiles_count = 0
        if iam_id:
            result = self.user_profile_repository.get_by_iam_id(iam_id)
            if result:
                user_profiles = [result]
                user_profiles_count = 1
        else:
            user_profiles = self.user_profile_repository.get_all(partner_id, type, page, per_page)
            user_profiles_count = self.user_profile_repository.get_count(partner_id, type)
        output_dtos = []
        for user_profile in user_profiles:
            identity = Kratos.get_identity(str(user_profile.iam_id))
            output_dtos.append(RetrieveUserProfileOutputDto(user_profile, identity["state"] == "active"))
        return RetrieveUserProfilesOutputDto(output_dtos, user_profiles_count)
