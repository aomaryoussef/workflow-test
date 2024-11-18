from typing import Dict

from src.domain.partner.dtos.validations.base_input_validator import BaseInputValidator
from src.domain.partner.models.bank_account import BankName


class CreatePartnerBankAccountInputDtoValidator(BaseInputValidator):
    def __init__(self, input_data: Dict) -> None:
        super().__init__(input_data)
        self.input_data = input_data
        self.__schema = {
            "partner_id": {
                "type": "string",
                "required": True,
                "empty": False,
            },
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
                "required": True,
                "empty": False,
            },
            "account_number": {
                "type": "string",
                "minlength": 3,
                "maxlength": 50,
                "required": True,
                "empty": False,
            },
        }

    def validate(self) -> None:
        super().verify(self.__schema)
