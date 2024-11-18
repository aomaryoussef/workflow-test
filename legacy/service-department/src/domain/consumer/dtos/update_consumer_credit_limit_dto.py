from uuid import UUID
from dataclasses import dataclass
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.consumer.models.credit_limit import CreditLimitDirection


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: UUID
    amount: int
    direction: CreditLimitDirection


@dataclass
class OutputDto(BaseOutputDto):
    credit_limit: int
