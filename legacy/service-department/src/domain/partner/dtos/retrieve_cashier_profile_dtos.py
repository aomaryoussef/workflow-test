from dataclasses import asdict, dataclass
from uuid import UUID
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.user_profile import UserProfile
from src.utils.dict_factory import asdict_factory


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    iam_id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    user_profile: UserProfile

    def to_dict(self):
        result = asdict(self.user_profile, dict_factory=asdict_factory)
        return result
