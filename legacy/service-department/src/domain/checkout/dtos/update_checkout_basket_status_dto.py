from dataclasses import asdict, dataclass
from uuid import UUID

from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus


@dataclass
class UpdateCheckoutBasketStatusInputDto:
    status: CheckoutBasketStatus
    workflow_id: UUID

    def __init__(self, status: CheckoutBasketStatus, workflow_id: UUID):
        self.status = status
        self.workflow_id = workflow_id

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)
