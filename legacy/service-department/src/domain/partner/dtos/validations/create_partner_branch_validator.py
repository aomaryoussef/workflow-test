from typing import Dict
from src.domain.partner.dtos.validations.base_input_validator import BaseInputValidator


class CreatePartnerBranchInputDtoValidator(BaseInputValidator):

    def __init__(self, input_data: Dict) -> None:
        super().__init__(input_data)
        self.input_data = input_data
        self.__schema = {
            "partner_id": {
                "type": "string",
                "required": True,
                "empty": False,
            },
            "name": {
                "type": "string",
                "required": True,
                "empty": False,
            },
            "governorate_id": {
                "type": "integer",
                "required": True,
                "empty": False,
            },
            "city_id": {
                "type": "integer",
                "required": True,
                "empty": False,
            },
            "area_id": {
                "type": "integer",
                "required": False,
                "nullable": True
            },
            "area": {
                "type": "string",
                "required": False,
                "nullable": True
            },
            "street": {
                "type": "string",
                "required": True,
                "empty": False,
            },
            "location": {
                "type": "dict",
                "required": True,
                "empty": False,
                "schema": {
                    "latitude": {
                        "type": "string",
                        "required": True,
                        "empty": False,
                    },
                    "longitude": {
                        "type": "string",
                        "required": True,
                        "empty": False,
                    },
                },
            },
            "google_maps_link": {
                "type": "string",
                "required": False,
                "empty": True,
            },
        }

    def validate(self) -> None:
        super().verify(self.__schema)
