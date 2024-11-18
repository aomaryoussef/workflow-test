from typing import Dict
from src.domain.partner.dtos.validations.base_input_validator import BaseInputValidator
from src.domain.partner.models.user_profile import ProfileType


class CreateUserProfileInputDtoValidator(BaseInputValidator):

    def __init__(self, data: Dict[str, str]):
        super().__init__(data)
        self.data = data
        self.__schema = {
            "iam_id": {
                "type": "string",
                "required": False,
                "nullable": True,
            },
            "partner_id": {
                "type": "string",
                "required": True,
                "empty": False,
            },
            "first_name": {
                "type": "string",
                "minlength": 3,
                "maxlength": 50,
                "required": True,
                "empty": False,
            },
            "last_name": {
                "type": "string",
                "minlength": 3,
                "maxlength": 50,
                "required": True,
                "empty": False,
            },
            "phone_number": {
                "type": "string",
                "regex": r"^\+2(010|011|012|015)[0-9]{8}$",
                "required": False,
                "empty": True,
            },
            "email": {
                "type": "string",
                "regex": r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
                "required": False,
                "nullable": True,
            },
            "national_id": {
                "type": "string",
                "minlength": 14,
                "maxlength": 14,
                "required": False,
                "nullable": True,
            },
            "profile_type": {
                "type": "string",
                "allowed": [e.value for e in ProfileType],
                "default": ProfileType.CASHIER.value,
            },
            "branch_id": {
                "type": "string",
                "required": False,
                "nullable": True,
            },
        }

    def validate(self) -> None:
        super().verify(self.__schema)
