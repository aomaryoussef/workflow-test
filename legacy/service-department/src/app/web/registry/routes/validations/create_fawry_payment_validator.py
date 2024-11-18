from pydantic import BaseModel


class CreateFawryPaymentValidator(BaseModel):
    channel_reference_id: str
    channel_transaction_id: str
    payee_id: str
    billing_account: str
    billing_account_scheduel_id: int
    amount_units: int
    created_by: str
