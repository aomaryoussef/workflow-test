from src.app.web.consumer.controllers.get_consumer_credit_limit_by_consumer_Id_controller import (
    GetConsumerCreditLimitByConsumerIdController,
)
from src.app.web.consumer.controllers.resend_consumer_recovery_phone_call_controller import (
    ResendConsumerRecoveryCodeViaPhoneCallController,
)
from src.domain.consumer.dtos.resend_consumer_recovery_code_voice_call_dto import (
    ResendConsumerRecoveryCodeVoiceCallOutputDto,
)
from src.domain.consumer.dtos.update_consumer_dto import UpdateConsumerOutputDto
from src.app.web.consumer.controllers.activate_consumer_controller import (
    ActivateConsumerController,
)
from src.app.web.consumer.controllers.update_consumer_controller import (
    UpdateConsumerController,
)
from sanic.response import json
from uuid import UUID
from src.app.web.consumer.controllers.create_consumer_controller import (
    CreateConsumerController,
)
from src.domain.consumer.use_cases.create_consumer import OutputDto as CreateConsumerOutputDto
from src.app.web.consumer.controllers.mark_set_password_controller import (
    MarkSetPasswordController,
)
from src.app.web.consumer.controllers.get_consumer_by_iam_id_controller import (
    GetConsumerByIamIdController,
)
from src.app.web.consumer.controllers.delete_consumer_controller import (
    DeleteConsumerController,
)
from src.app.web.consumer.controllers.get_consumer_by_phone_number_controller import (
    GetConsumerByPhoneNumberController,
)
from src.app.web.consumer.controllers.get_consumer_credit_limits_controller import (
    GetConsumerCreditLimitsController,
)
from src.app.web.consumer.controllers.get_consumer_by_id_controller import (
    GetConsumerByIdController,
)
from src.app.web.consumer.controllers.get_consumer_loans_controller import (
    GetConsumerLoansController,
)
from src.app.web.consumer.controllers.resend_consumer_recovery_controller import (
    ResendConsumerRecoveryCodeController,
)
from src.app.web.consumer.routes.validations.activate_consumer_validator import (
    ActivateConsumerValidator,
)
from src.app.web.consumer.routes.validations.create_consumer_validator import (
    CreateConsumerValidator,
)
from src.app.web.consumer.controllers.get_consumer_loan_details_controller import (
    GetConsumerLoanDetailsController,
)
from src.app.web.consumer.routes.validations.loan_details_validator import (
    LoanDetailsValidator,
)
from sanic import Blueprint
from sanic_ext import validate, openapi
from src.domain.consumer.models.consumer import Consumer
from src.domain.consumer.use_cases.resend_consumer_recovery import OutputDto as ResendConsumerRecoveryCodeOutputDto
from src.app.web.consumer.routes.validations.get_consumer_by_phone_number_validator import (
    GetConsumerByPhoneNumberValidator,
)
from src.app.web.consumer.routes.validations.resend_consumer_recovery_code_validator import (
    ResendConsumerRecoveryCodeValidator,
)
from src.utils.web import GenericWebError
from src.app.web.consumer.controllers.update_consumer_credit_limit_controller import (
    UpdateConsumerCreditLimitController,
)
from src.app.web.consumer.routes.validations.update_consumer_credit_limit_Validator import (
    UpdateConsumerCreditLimitInputValidator,
)
from src.domain.consumer.dtos.update_consumer_credit_limit_dto import (
    OutputDto as UpdateConsumerCreditLimitOutputDto,
    InputDto as UpdateConsumerCreditLimitInputDto,
)
from src.domain.consumer.models.credit_limit import CreditLimitDirection

consumers_blueprint = Blueprint("consumer", url_prefix="/consumers", version=1)


# POST - /v1/consumers/identity
@consumers_blueprint.post("/mark-set-password")
def test_identity(request):
    controller = MarkSetPasswordController(request.json.get("user_id", ""))
    result = controller.execute()
    return result


# POST - /v1/consumers
@consumers_blueprint.post("")
@openapi.summary("Create a consumer")
@openapi.body(
    {
        "application/json": {
            "phone_number": str,
            "ssn": str,
        }
    }
)
@openapi.response(
    409,
    {"application/json": {"message": str, "identity_conflict": bool, "mc_conflict": bool, "password_created": bool}},
)
@openapi.response(
    201,
    {"application/json": CreateConsumerOutputDto},
)
@validate(json=CreateConsumerValidator)
def create_consumer(_, body: CreateConsumerValidator):
    phone_number = body.model_dump().get("phone_number")
    ssn = body.model_dump().get("ssn", None)  # Set ssn as optional with default value None
    controller = CreateConsumerController(phone_number=phone_number, ssn=ssn)
    result = controller.execute()
    return result


# PUT - /v1/consumers
@consumers_blueprint.put("/")
@openapi.summary("Update Consumers")
@openapi.description("This API is used to update a consumer data")
@openapi.body(
    {
        "application/json": {
            "id": str,
            "full_name": str,
            "national_id": str,
            "address": str,
            "job_name": str,
            "work_type": str,
            "club": str,
            "house_type": str,
            "city": str,
            "district": str,
            "governorate": str,
            "salary": int,
            "additional_salary": int,
            "address_description": str,
            "guarantor_job": str,
            "guarantor_relationship": str,
            "car_year": int,
            "marital_status": str,
            "company": str,
            "single_payment_day": int,
        }
    }
)
@openapi.response(404, {"application/json": {"message": str}})
@openapi.response(
    200,
    {"application/json": {"data": UpdateConsumerOutputDto}},
)
def update_consumer(request):
    controller = UpdateConsumerController(consumer_input=request.json)
    result = controller.execute()
    return result


# POST - /v1/consumers/identity/resend-recovery
@consumers_blueprint.post("/identity/resend-recovery")
@openapi.summary("Resend consumer recovery code")
@openapi.body({"application/json": {"phone_number": str}})
@openapi.response(
    200,
    {"application/json": {"data": ResendConsumerRecoveryCodeOutputDto}},
)
@openapi.response(
    400,
    {"application/json": {"error": str}},
)
@validate(json=ResendConsumerRecoveryCodeValidator)
def resend_onboarding_otp(_, body: ResendConsumerRecoveryCodeValidator):
    controller = ResendConsumerRecoveryCodeController(body.model_dump()["phone_number"])
    result = controller.execute()
    return result


# POST - /v1/consumers/identity/callme
@consumers_blueprint.post("/identity/callme")
@openapi.summary("Resend consumer recovery code via phone call")
@openapi.body({"application/json": {"phone_number": str}})
@openapi.response(
    200,
    {"application/json": {"data": ResendConsumerRecoveryCodeVoiceCallOutputDto}},
)
@openapi.response(
    400,
    {"application/json": {"error": str}},
)
@validate(json=ResendConsumerRecoveryCodeValidator)
def resend_onboarding_otp_via_phone_call(_, body: ResendConsumerRecoveryCodeValidator):
    controller = ResendConsumerRecoveryCodeViaPhoneCallController(body.model_dump()["phone_number"])
    result = controller.execute()
    return result


# GET - /v1/consumers?phone_number=<phone_number:str>&iam_id=<iam_id:str>
@consumers_blueprint.get("")
@openapi.summary("Get consumer by phone number")
@openapi.parameter("phone_number", str)
@openapi.response(200, {"application/json": {"data": Consumer}})
@validate(query=GetConsumerByPhoneNumberValidator)
def get_consumer(_, query):
    phone_number = query.phone_number if query.phone_number else None
    if phone_number is not None:
        controller = GetConsumerByPhoneNumberController(phone_number)
        return controller.execute()
    elif query.iam_id is not None:
        controller = GetConsumerByIamIdController(query.iam_id)
        return controller.execute()
    return json({"message": "Missing query parameter"}, status=400)


# GET - /v1/consumers/credit-limits/{consumer_id}
@consumers_blueprint.get("/credit-limits/<consumer_id>")
@openapi.summary("Get consumer credit limits by consumer id")
def get_consumer_credit_limits(_, consumer_id: str):
    controller = GetConsumerCreditLimitsController(consumer_id)
    return controller.execute()


# PUT - /{consumer_id}/credit-limit
@consumers_blueprint.put("/<consumer_id:str>/credit-limit")
@openapi.summary("Update Consumer Credit Limit")
@openapi.description("This API is used to update a consumer credit limit")
@openapi.body(
    {
        "application/json": {
            "amount": int,
            "direction": {
                "type": "string",
                "enum": [
                    CreditLimitDirection.INCREASE.value,
                    CreditLimitDirection.DECREASE.value,
                ],
                "nullable": True,
            },
        }
    }
)
@openapi.response(404, {"application/json": {"message": str}})
@openapi.response(
    200,
    {"application/json": {"data": UpdateConsumerCreditLimitOutputDto}},
)
@validate(json=UpdateConsumerCreditLimitInputValidator)
def update_consumer_credit_limit(_, consumer_id: str, body: UpdateConsumerCreditLimitInputDto):
    body = body.model_dump()
    controller = UpdateConsumerCreditLimitController(
        consumer_id,
        body["amount"],
        (body["direction"] if body["direction"] else CreditLimitDirection.DECREASE),
    )
    result = controller.execute()
    return result


@consumers_blueprint.get("/<consumer_id>/credit-limit")
@openapi.summary("Get consumer credit limit by consumer id")
def get_consumer_credit_limit_by_consumer_id(_, consumer_id: str):
    controller = GetConsumerCreditLimitByConsumerIdController(consumer_id)
    return controller.execute()


# GET - /consumers/{consumer_id}
@consumers_blueprint.get("/<consumer_id>")
@openapi.summary("Get consumer by consumer id")
@openapi.response(200, {"application/json": Consumer})
@openapi.response(400, {"application/json": GenericWebError})
def get_consumer_by_id(_, consumer_id: UUID):
    controller = GetConsumerByIdController(consumer_id)
    result = controller.execute()
    return result


# GET - /v1/consumers/loans/{consumer_id}
@consumers_blueprint.get("/loans/<consumer_id>")
@openapi.summary("Get consumer credit limits by consumer id")
def get_consumer_loans(_, consumer_id: str):
    controller = GetConsumerLoansController(consumer_id)
    return controller.execute()


# GET - /v1/consumers/loan-details/{consumer_id}?loan_id=<loan_id:str>&installment_id=<installment_id:int>
@consumers_blueprint.get("/loan-details/<consumer_id>")
@openapi.summary("Get consumer loan details")
@openapi.parameter("loan_id", str)
@openapi.parameter("installment_id", int)
@validate(query_argument=LoanDetailsValidator)
def get_consumer_loan_details(request, consumer_id: str):
    loan_id = request.args.get("loan_id")
    installment_id = int(request.args.get("installment_id"))
    controller = GetConsumerLoanDetailsController(consumer_id, loan_id, installment_id)
    return controller.execute()


# POST - /v1/consumers
@consumers_blueprint.delete("")
@openapi.summary("Delete consumer")
@openapi.body(
    {
        "application/json": {
            "phone_number": str,
        }
    }
)
@openapi.response(
    200,
    {"application/json": {}},
)
@validate(json=CreateConsumerValidator)
def delete_consumer(_, body: CreateConsumerValidator):
    controller = DeleteConsumerController(body.model_dump()["phone_number"])
    result = controller.execute()
    return result


# POST - /v1/consumers/{id}/activate
@consumers_blueprint.post("<id:str>/activate")
@openapi.summary("Activate consumer")
@openapi.body(
    {
        "application/json": {
            "credit_limit": int,
        }
    }
)
@openapi.response(200, {"application/json": Consumer})
@validate(json=ActivateConsumerValidator)
def activate_consumer(request, id: str, body: ActivateConsumerValidator):
    controller = ActivateConsumerController(id, body.model_dump()["credit_limit"], body.model_dump()["credit_officer_iam_id"], body.model_dump()["branch_name"])
    result = controller.execute()
    return result