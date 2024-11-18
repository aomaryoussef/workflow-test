from typing import Optional
from dataclasses import asdict, dataclass
from uuid import UUID
from src.utils.dict_factory import asdict_factory
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.user_profile import UserProfile


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner_id: UUID
    first_name: str
    last_name: str
    email: str
    phone_number: str
    national_id: Optional[str] = None
    branch_id: Optional[UUID] = None


@dataclass
class OutputDto(BaseOutputDto):
    user_profile: UserProfile

    def to_dict(self):
        result = asdict(self.user_profile, dict_factory=asdict_factory)
        return result