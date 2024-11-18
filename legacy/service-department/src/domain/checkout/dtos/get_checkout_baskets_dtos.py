""" Module for Partner Dtos
"""

from typing import Optional
from datetime import datetime
from uuid import UUID
from dataclasses import asdict, dataclass, field
from src.utils.dict_factory import asdict_factory
from src.domain.checkout.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    consumer_id: Optional[UUID] = None
    statuses: list[CheckoutBasketStatus] = field(default_factory=list)


@dataclass
class CustomCheckoutBasket:
    basket_id: UUID
    partner_name: str
    partner_id: UUID
    branch_id: UUID
    consumer_id: UUID
    session_basket_id: UUID
    products: list[dict[str, any]]
    gross_basket_value: int
    category: str
    loan_id: UUID
    created_at: datetime
    status: CheckoutBasketStatus
    transaction_id: int


@dataclass
class OutputDto(BaseOutputDto):
    checkout_baskets: list[CustomCheckoutBasket]

    def to_dict(self):
        result = [asdict(checkout_basket, dict_factory=asdict_factory) for checkout_basket in self.checkout_baskets]
        return result
