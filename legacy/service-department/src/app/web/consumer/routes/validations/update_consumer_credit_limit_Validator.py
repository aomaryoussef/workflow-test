from typing import Optional
from pydantic import BaseModel
from src.domain.consumer.models.credit_limit import CreditLimitDirection


class UpdateConsumerCreditLimitInputValidator(BaseModel):
    amount: int
    direction: Optional[CreditLimitDirection] = CreditLimitDirection.DECREASE
