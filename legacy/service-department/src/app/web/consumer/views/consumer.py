from sanic.response import json
from sanic.response.types import JSONResponse
from src.app.web.base.views import BaseViews
from src.domain.consumer.dtos.resend_consumer_recovery_code_voice_call_dto import (
    ResendConsumerRecoveryCodeVoiceCallOutputDto,
)
from src.domain.consumer.dtos.update_consumer_dto import UpdateConsumerOutputDto
from src.utils.exceptions import ConflictException


class ResendConsumerRecoveryCodeViaPhoneCallView:
    @staticmethod
    def show(output_dto: ResendConsumerRecoveryCodeVoiceCallOutputDto) -> JSONResponse:
        return json(
            {"data": {"identity": output_dto.identity_id, "flow_id": output_dto.flow_id}},
            status=200,
        )

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Unable to resend recovery code via phone call", "errors": str(error)}, status=400)


class UpdateConsumerView:
    @staticmethod
    def show(output_dto: UpdateConsumerOutputDto) -> JSONResponse:
        return json(
            {"data": output_dto},
            status=200,
        )

    @staticmethod
    def show_conflict_error(id: str) -> JSONResponse:
        """Present conflict error
        :param id: Exception
        :return: JSONResponse
        """
        return json({"message": "No record found for " + id}, status=409)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "update Failed", "errors": str(error)}, status=400)


class DeleteConsumerView:
    @staticmethod
    def show(deleted: bool) -> JSONResponse:
        """Present the Retrieve Partner by phone number"""
        return json({"message": deleted}, status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class GetConsumerByPhoneNumberView:
    def show(output_dto) -> JSONResponse:
        """Present the Retrieve Partner by phone number"""
        return json(output_dto.to_dict(), status=200)

    def not_found() -> JSONResponse:
        """Present not found consumer"""
        return json({"message": "Consumer not found"}, status=404)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class GetConsumerLoansView:
    def show(output_dto) -> JSONResponse:
        """Present the Retrieve consumer loans"""
        return json(output_dto.to_dict(), status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class GetConsumerLoanDetailsView:
    def show(output_dto) -> JSONResponse:
        """Present the Retrieve consumer loan details"""
        return json(output_dto.to_dict(), status=200)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class GetConsumerCreditLimitsView:
    def show(output_dto) -> JSONResponse:
        """Present the Retrieve consumer credit limits"""
        return json(output_dto.to_dict(), status=200)

    def not_found() -> JSONResponse:
        """Present not found consumer credit limits"""
        return json({"message": "Consumer credit limits not found"}, status=404)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class GetConsumerByIamIdView:
    def show(output_dto) -> JSONResponse:
        """Present the Retrieve Partner by phone number"""
        return json(output_dto.to_dict(), status=200)

    def not_found() -> JSONResponse:
        """Present not found consumer"""
        return json({"message": "Consumer not found"}, status=404)

    @staticmethod
    def show_error(error: Exception) -> JSONResponse:
        """Present the error
        :param error: Exception
        :return: JSONResponse
        """
        return json({"message": "Validation Failed", "errors": str(error)}, status=400)


class ConsumerViews(BaseViews):

    @staticmethod
    def error(error: Exception) -> JSONResponse:
        # Call the base class error method
        base_response = BaseViews.error(error)

        # Add custom checks for ConsumerViews
        if isinstance(error, ConflictException):
            return json(
                {
                    "message": "Conflict for " + error.phone_number,
                    "identity_conflict": error.identity_conflict,
                    "mc_conflict": error.mc_conflict,
                    "password_created": error.password_created,
                },
                status=409,
            )

        # Return the base response if no custom checks match
        return base_response