from dataclasses import asdict, dataclass
from uuid import UUID
from typing import List, Optional

from src.domain.checkout.models.checkout_basket import CheckoutBasket


@dataclass(frozen=True)
class CreateCheckoutBasketInputDto:
    """Dataclass for CheckoutBasket  information"""

    partner_id: UUID
    cashier_id: UUID
    branch_id: UUID
    consumer_id: UUID
    session_basket_id: UUID
    products: List[dict[str, any]]
    gross_basket_value: int
    category: str
    origination_channel: str
    consumer_device_metadata: Optional[dict[str, any]] = None

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)


@dataclass
class CreateCheckoutBasketOutputDto:
    """Output Dto for creating a CheckoutBasket"""

    checkout_basket: CheckoutBasket

    def to_dict(self):
        return self.checkout_basket.to_dict()
