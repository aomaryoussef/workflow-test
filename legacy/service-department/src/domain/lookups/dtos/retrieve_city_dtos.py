from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.city import City
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class InputDto:
    id: int


@dataclass
class OutputDto(BaseOutputDto):
    city: City

    def to_dict(self):
        return asdict(self.city, dict_factory=asdict_factory)
