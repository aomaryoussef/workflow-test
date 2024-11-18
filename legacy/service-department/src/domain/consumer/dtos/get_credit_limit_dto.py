from uuid import UUID
from dataclasses import dataclass
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    credit_limit: int
