from pydantic import BaseModel


class ResetUserPasswordValidator(BaseModel):
    identifier: str
