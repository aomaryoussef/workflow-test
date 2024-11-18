from dataclasses import asdict, dataclass
from typing import List
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.area import Area
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class OutputDto(BaseOutputDto):
    areas: List[Area]

    def to_dict(self):
        return [asdict(area, dict_factory=asdict_factory) for area in self.areas]
