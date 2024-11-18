from sanic.response import json
from sanic.response.types import JSONResponse
from typing import Any, Dict
from src.domain.checkout.dtos.accept_down_payment_dto import AcceptDownPaymentOutputDto
from src.domain.checkout.dtos.create_checkout_basket_dto import (
    CreateCheckoutBasketOutputDto,
)
from src.domain.checkout.dtos.retrieve_checkout_basket_dto import (
    RetrieveCheckoutBasketOutputDto,
)

from src.utils.exceptions import ConflictException


class AcceptDownPaymentView:
    @staticmethod
    def show(output_dto: AcceptDownPaymentOutputDto) -> JSONResponse:
        return json({"data": {"checkout_basket": output_dto.to_dict()}}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": str(error)}, status=400)


class SelectCommercialOfferView:
    @staticmethod
    def show(output_dto: Dict[str, Any]) -> JSONResponse:
        return json({"data": {"offer": output_dto}}, status=201)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": str(error)}, status=400)


class VerifyCheckoutOtpView:
    @staticmethod
    def show(status: str) -> JSONResponse:
        return json({"data": {"status": status}}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Unable to verify OTP", "errors": str(error)}, status=400)


class TriggerSendOtpView:
    @staticmethod
    def show(phone_number: str) -> JSONResponse:
        return json({"data": {"phone_number": phone_number}}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Unable to send OTP", "errors": str(error)}, status=400)


class ResendOtpView:
    @staticmethod
    def show(phone_number: str) -> JSONResponse:
        return json({"data": {"phone_number": phone_number}}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Unable to resend OTP", "errors": str(error)}, status=400)


class ResendOtpViaPhoneCallView:
    @staticmethod
    def show(phone_number: str) -> JSONResponse:
        return json({"data": {"phone_number": phone_number}}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Unable to resend OTP via voice call", "errors": str(error)}, status=400)


class CreateCheckoutBasketView:
    """Class for the CreateCheckoutBasketView"""

    @staticmethod
    def show(output_dto: CreateCheckoutBasketOutputDto) -> JSONResponse:
        """Present the CreateCheckout
        :param output_dto: CreateCheckoutOutput
        :return: JSONResponse
        """
        return json({"data": {"checkout_basket": output_dto.to_dict()}}, status=201)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class RetrieveCommercialOffersView:
    @staticmethod
    def show(output_dto: list[dict[str, Any]]) -> JSONResponse:
        return json({"commercial_offers": output_dto})

    def show_not_found_error() -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Basket not found"}, status=404)

    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class RetrieveCheckoutBasketView:
    @staticmethod
    def show(output_dto: RetrieveCheckoutBasketOutputDto) -> JSONResponse:
        return json({"data": {"checkout_basket": output_dto.to_dict()}}, status=200)

    @staticmethod
    def show_not_found_error() -> JSONResponse:
        return json({"message": "Basket not found"}, status=404)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class CancelCheckoutView:
    @staticmethod
    def show(output_dto: Dict[str, Any]) -> JSONResponse:
        return json({"data": output_dto}, status=200)

    def show_not_found_error() -> JSONResponse:
        return json({"message": "Basket not found"}, status=404)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)

    @staticmethod
    def show_conflict_error(error: ConflictException) -> JSONResponse:
        return json({"message": str(error)}, status=409)


class CancelActiveCheckoutView:
    @staticmethod
    def show() -> JSONResponse:
        return json({}, status=204)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        return json({"message": "Error processing this request", "errors": str(error)}, status=200)
