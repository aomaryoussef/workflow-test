from pydantic import BaseModel
from src.domain.checkout.models.checkout_basket import CheckoutBasketCancelStatues


class CancelCheckoutBasketValidator(BaseModel):
    status: CheckoutBasketCancelStatues

    class Config:
        use_enum_values = True
