""" Defines the validator for the create checkout basket input data."""


from typing import Dict

from src.domain.checkout.dtos.validations.base_input_validator import BaseInputValidator


class CreateCommercialOffersInputValidator(BaseInputValidator):
    """Validates the create checkout basket input data.
    :param input_data: The input data to be validated.
    """

    def __init__(self, data: Dict[str, str]):
        super().__init__(data)
        self.data = data
        self.__schema = {
            "workflow_id": {"type": "string"},
            "offer_details": {
                "type": "list",
                "schema": {
                    "type": "dict",
                    "schema": {
                        "id": {"type": "string", "required": True},
                        "tenure": {"type": "string", "required": True},
                        "monthly_payment_per_tenure": {
                            "type": "dict",
                            "schema": {
                                "units": {"type": "integer", "required": True},
                                "currency": {"type": "string", "required": True},
                            },
                            "required": True,
                        },
                        "admin_fees": {
                            "type": "dict",
                            "schema": {
                                "units": {"type": "integer", "required": True},
                                "currency": {"type": "string", "required": True},
                            },
                            "required": True,
                        },
                        "financed_amount": {
                            "type": "dict",
                            "schema": {
                                "units": {"type": "integer", "required": True},
                                "currency": {"type": "string", "required": True},
                            },
                            "required": True,
                        },
                        "total_amount": {
                            "type": "dict",
                            "schema": {
                                "units": {"type": "integer", "required": True},
                                "currency": {"type": "string", "required": True},
                            },
                            "required": True,
                        },
                        "interest_rate_per_tenure": {"type": "string", "required": True},
                        "downpayment_per_tenure": {
                            "type": "dict",
                            "schema": {
                                "units": {"type": "integer", "required": True},
                                "currency": {"type": "string", "required": True},
                            },
                            "required": True,
                        },
                    },
                    "required": True,
                },
                "required": True,
            },
        }

    def validate(self) -> None:
        """Validates the input data"""
        # Verify the input data using BaseInputValidator method
        super().verify(self.__schema)
