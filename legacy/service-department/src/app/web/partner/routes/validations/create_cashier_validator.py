from typing import Optional
from pydantic import BaseModel


class CreateCashierValidator(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    branch_id: str
    email: Optional[str] = None
