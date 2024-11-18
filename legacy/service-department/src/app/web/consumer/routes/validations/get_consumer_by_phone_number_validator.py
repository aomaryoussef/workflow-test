from pydantic import BaseModel


class GetConsumerByPhoneNumberValidator(BaseModel):
    phone_number: str = None
    iam_id: str = None
