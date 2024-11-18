from dataclasses import asdict, dataclass
from typing import List
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.city import City
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class OutputDto(BaseOutputDto):
    cities: List[City]

    def to_dict(self):
        return [asdict(city, dict_factory=asdict_factory) for city in self.cities]
