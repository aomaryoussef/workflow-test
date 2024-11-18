from typing import Dict

from src.domain.partner.dtos.validations.base_input_validator import BaseInputValidator
from src.domain.partner.models.partner import PartnerCategory


class CreatePartnerEntityInputDtoValidator(BaseInputValidator):

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
                "required": True,
                "regex": r"^[0-9]{1,80}$",
                "empty": False,
            },
        }

    def validate(self) -> None:
        super().verify(self.__schema)
