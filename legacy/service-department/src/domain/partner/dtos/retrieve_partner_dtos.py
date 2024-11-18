from uuid import UUID
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.models.partner import Partner
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    partner: Partner

    def to_dict(self):
        result = asdict(self.partner, dict_factory=asdict_factory)
        return result
