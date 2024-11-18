from typing import Optional
from pydantic import BaseModel


class CreateBranchManagerValidator(BaseModel):
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    branch_id: str
    email: str
    branch_id: str
