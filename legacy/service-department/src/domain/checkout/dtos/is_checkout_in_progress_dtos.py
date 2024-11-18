""" Module for Partner Dtos
"""

from uuid import UUID
from dataclasses import dataclass
from src.domain.checkout.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: UUID
    checkout_basket_id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    result: bool
