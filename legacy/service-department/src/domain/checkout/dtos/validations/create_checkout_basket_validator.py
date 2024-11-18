""" Defines the validator for the create checkout basket input data."""


from typing import Dict

from src.domain.checkout.dtos.validations.base_input_validator import BaseInputValidator


class CreateCheckoutBasketValidator(BaseInputValidator):
    """Validates the create checkout basket input data.
    :param input_data: The input data to be validated.
    """

    def __init__(self, data: Dict[str, str]):
        super().__init__(data)
        self.data = data
        self.__schema = {
            "partner_id": {
                "type": "string",
                "regex": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                "required": True,
                "empty": False,
            },
            "branch_id": {
                "type": "string",
                "regex": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                "required": True,
                "empty": False,
            },
            "cashier_id": {
                "type": "string",
                "regex": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                "required": True,
                "empty": False,
            },
            "consumer_id": {
                "type": "string",
                "regex": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                "required": True,
                "empty": False,
            },
            "session_basket_id": {
                "type": "string",
                "regex": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                "required": True,
                "empty": False,
            },
            "origination_channel": {
                "type": "string",
                "required": False,
                "empty": True,
            },
            "gross_basket_value": {"type": "integer", "required": True},
            "products": {
                "type": "list",
                "required": True,
                "schema": {
                    "type": "dict",
                    "required": True,
                    "schema": {
                        "name": {"type": "string", "required": True, "empty": False},
                        "price": {"type": "integer", "required": True},
                        "count": {"type": "integer", "required": False},
                        "category": {
                            "type": "string",
                            "required": False,
                            "empty": False,
                        },
                    },
                },
            },
            "consumer_device_metadata": {
                "type": "dict",
                "required": False,
                "schema": {
                    "brand": {"type": "string", "required": False, "empty": False},
                    "model": {"type": "string", "required": False, "empty": False},
                    "app_version": {"type": "string", "required": False, "empty": False},
                    "os_version": {"type": "string", "required": False, "empty": False},
                },
            },
            "category": {
                    "type": "string",
                    "required": True,
                    "empty": False,
            },
        }

    def validate(self) -> None:
        """Validates the input data"""
        # Verify the input data using BaseInputValidator method
        super().verify(self.__schema)
