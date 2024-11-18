from pydantic import BaseModel, EmailStr


class SettleBTechLoanValidator(BaseModel):
    branch_id: str
    collection_agent_email: EmailStr
    payee_id: str
    loan_id: str
    amount_units: int

    class Config:
        use_enum_values = True
