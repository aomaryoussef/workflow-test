from typing import Optional
from pydantic import BaseModel


class CreateConsumerValidator(BaseModel):
    phone_number: str
    ssn: Optional[str] = None