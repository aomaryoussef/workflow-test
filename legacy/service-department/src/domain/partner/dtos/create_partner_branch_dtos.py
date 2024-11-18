from typing import Optional
from uuid import UUID
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.branch import Coordinates, Branch


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner_id: UUID
    name: str
    governorate_id: int
    city_id: int
    area_id: Optional[int]
    area: Optional[str]
    street: str
    location: Coordinates
    google_maps_link: str


@dataclass
class OutputDto(BaseOutputDto):
    branch: Branch

    def to_dict(self):
        result = asdict(self.branch, dict_factory=asdict_factory)
        return result
