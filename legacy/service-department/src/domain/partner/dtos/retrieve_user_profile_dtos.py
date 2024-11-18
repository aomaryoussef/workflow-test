from dataclasses import asdict, dataclass
from typing import List
from uuid import UUID
from src.domain.partner.models.user_profile import UserProfile
from src.utils.dict_factory import asdict_factory


@dataclass(frozen=True)
class RetrieveUserProfileInputDto:
    user_profile_id: UUID


@dataclass
class RetrieveUserProfileOutputDto:
    user_profile: UserProfile
    enabled: bool

    def __init__(self, user_profile: UserProfile, enabled: bool):
        self.user_profile = user_profile
        self.enabled = enabled

    def to_dict(self):
        result = asdict(self.user_profile, dict_factory=asdict_factory)
        result["enabled"] = self.enabled
        return result


@dataclass
class RetrieveUserProfilesOutputDto:
    data: List[RetrieveUserProfileOutputDto]
    total_count: int

    def __init__(self, data: List[RetrieveUserProfileOutputDto], total_count: int):
        self.data = data
        self.total_count = total_count

    def to_dict(self):
        return {
            "data": [user_profile.to_dict() for user_profile in self.data],
            "total_count": self.total_count,
        }
