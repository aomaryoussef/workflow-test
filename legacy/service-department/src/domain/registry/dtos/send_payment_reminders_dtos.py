from dataclasses import dataclass
from src.domain.registry.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    pass


@dataclass
class OutputDto(BaseOutputDto):
    number_of_due_today: int
    number_of_due_4_days_ago: int
    number_of_due_21_days_ago: int
