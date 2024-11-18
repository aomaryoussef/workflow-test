from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.area import Area
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class InputDto:
    id: int


@dataclass
class OutputDto(BaseOutputDto):
    area: Area

    def to_dict(self) -> dict:
        return asdict(self.area, dict_factory=asdict_factory)
