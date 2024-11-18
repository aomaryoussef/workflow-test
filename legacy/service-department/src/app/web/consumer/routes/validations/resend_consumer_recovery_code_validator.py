from pydantic import BaseModel


class ResendConsumerRecoveryCodeValidator(BaseModel):
    phone_number: str
