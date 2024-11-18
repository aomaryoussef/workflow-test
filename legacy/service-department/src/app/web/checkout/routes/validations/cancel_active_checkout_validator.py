from pydantic import BaseModel
from typing import Optional


class CancelActiveCheckoutValidator(BaseModel):
    consumer_phone_number: Optional[str] = None
