from uuid import UUID
from dataclasses import dataclass
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    active: bool
