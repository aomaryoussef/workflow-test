from typing import Optional
from pydantic import BaseModel


class RetrievePaymentsValidator(BaseModel):
    billing_account: Optional[str] = None
    billing_account_schedule_id: Optional[int] = None
