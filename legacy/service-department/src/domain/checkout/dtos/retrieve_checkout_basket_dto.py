from dataclasses import dataclass
from src.domain.checkout.models.checkout_basket import CheckoutBasket


@dataclass
class RetrieveCheckoutBasketOutputDto:
    """Output Dto for retrieving the CheckoutBasket"""

    checkout_basket: CheckoutBasket

    def to_dict(self):
        return self.checkout_basket.to_dict()
