from pydantic import BaseModel


class LoanDetailsValidator(BaseModel):
    loan_id: str
    installment_id: int
