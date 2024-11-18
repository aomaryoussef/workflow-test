from pydantic import BaseModel
from src.domain.registry.models.payment import PaymentStatus


class UpdatePaymentValidator(BaseModel):
    status: PaymentStatus

    class Config:
        use_enum_values = True
