from dataclasses import asdict, dataclass
from typing import List
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.governorate import Governorate
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class OutputDto(BaseOutputDto):
    governorates: List[Governorate]

    def to_dict(self):
        return [asdict(gov, dict_factory=asdict_factory) for gov in self.governorates]
