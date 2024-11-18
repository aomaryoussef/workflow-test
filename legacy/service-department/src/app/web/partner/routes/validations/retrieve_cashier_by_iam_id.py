from pydantic import BaseModel


class RetrieveCashierByIamIdValidator(BaseModel):
    iam_id: str = None
