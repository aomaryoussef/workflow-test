from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.lookups.models.governorate import Governorate
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class InputDto:
    id: int


@dataclass
class OutputDto(BaseOutputDto):
    governorates: Governorate

    def to_dict(self):
        return asdict(self.governorate, dict_factory=asdict_factory)
