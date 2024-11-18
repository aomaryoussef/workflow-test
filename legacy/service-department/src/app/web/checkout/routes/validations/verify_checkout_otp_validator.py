from pydantic import BaseModel


class VerifyCheckoutOtpValidator(BaseModel):
    otp: str
