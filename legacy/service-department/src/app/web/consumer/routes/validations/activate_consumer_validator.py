from pydantic import BaseModel


class ActivateConsumerValidator(BaseModel):
    credit_limit: int
    credit_officer_iam_id: str
    branch_name: str
