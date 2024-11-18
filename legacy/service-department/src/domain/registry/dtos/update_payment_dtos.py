from ulid import ULID
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.registry.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.registry.models.payment import Payment, PaymentStatus


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    id: ULID
    status: PaymentStatus


@dataclass
class OutputDto(BaseOutputDto):
    payment: Payment

    def to_dict(self):
        result = asdict(self.payment, dict_factory=asdict_factory)
        return result
