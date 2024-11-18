from typing import Optional
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.registry.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.registry.models.payment import Payment


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    billing_account: Optional[str] = None
    billing_account_schedule_id: Optional[int] = None


@dataclass
class OutputDto(BaseOutputDto):
    payments: list[Payment]

    def to_dict(self):
        result = [asdict(payment, dict_factory=asdict_factory) for payment in self.payments]
        return result
