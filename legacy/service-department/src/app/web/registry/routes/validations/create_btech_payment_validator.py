from pydantic import BaseModel, EmailStr


class CreateBTechPaymentValidator(BaseModel):
    branch_id: str
    collection_agent_email: EmailStr
    payee_id: str
    loan_id: str
    loan_scheduel_id: int
    amount_units: int

    class Config:
        use_enum_values = True
