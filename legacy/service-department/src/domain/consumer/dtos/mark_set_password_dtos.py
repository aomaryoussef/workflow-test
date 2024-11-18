""" Module for Partner Dtos
"""

from uuid import UUID
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    iam_id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    success: bool = True

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
