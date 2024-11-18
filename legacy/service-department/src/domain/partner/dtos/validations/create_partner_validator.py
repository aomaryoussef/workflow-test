from typing import Dict

from src.domain.partner.dtos.validations.base_input_validator import BaseInputValidator
from src.domain.partner.models.partner import PartnerCategory
from src.domain.partner.models.bank_account import BankName


class CreatePartnerInputDtoValidator(BaseInputValidator):

    def __init__(self, input_data: Dict) -> None:
        super().__init__(input_data)
        self.input_data = input_data
        self.__schema = {
            "name": {
                "type": "string",
                "minlength": 3,
                "maxlength": 80,
                "required": True,
                "empty": False,
            },
            "categories": {
                "type": "list",
                "schema": {
                    "type": "string",
                    "allowed": [e.value for e in PartnerCategory],
                },
                "required": True,
                "empty": False,
            },
            "tax_registration_number": {
                "type": "string",
                "minlength": 9,
                "maxlength": 9,
                "regex": r"^[0-9]{9}$",
                "required": True,
                "empty": False,
            },
            "commercial_registration_number": {
                "type": "string",
                "required": False,
                "regex": r"^[0-9]{1,80}$",
                "empty": True,
            },
            "bank_account": {
                "type": "dict",
                "required": True,
                "empty": False,
                "schema": {
                    "bank_name": {
                        "type": "string",
                        "allowed": [e.value for e in BankName],
                        "required": True,
                        "empty": False,
                    },
                    "branch_name": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 50,
                        "required": True,
                        "empty": False,
                    },
                    "beneficiary_name": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 50,
                        "required": True,
                        "empty": False,
                    },
                    "iban": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 50,
                        "required": True,
                        "empty": False,
                    },
                    "swift_code": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 50,
                        "required": False,
                        "empty": True,
                    },
                    "account_number": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 50,
                        "required": True,
                        "empty": False,
                    },
                },
            },
            "admin_user": {
                "type": "dict",
                "required": True,
                "empty": False,
                "schema": {
                    "first_name": {
                        "type": "string",
                        "minlength": 3,
                        "maxlength": 80,
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
                        "required": True,
                        "empty": False,
                    },
                    "email": {
                        "type": "string",
                        "regex": r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$",
                        "required": True,
                        "empty": False,
                    },
                },
            },
        }

    def validate(self) -> None:
        super().verify(self.__schema)
