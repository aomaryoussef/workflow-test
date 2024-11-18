from typing import Optional
from src.app.web.partner.controllers.retrieve_partner_transactions_controller import (
    RetrievePartnerTransactionsController,
)
from src.app.web.partner.controllers.retrieve_transaction_details_controller import RetrieveTransactionDetailsController
from src.domain.partner.dtos.retrieve_partner_transaction_details_dtos import (
    OutputDto as RetrieveTransactionDetailsOutputDto,
)
from src.app.web.partner.controllers.retrieve_cashier_profile_controller import RetrieveCashierProfileController
from src.app.web.partner.routes.validations.retrieve_cashier_by_iam_id import RetrieveCashierByIamIdValidator
from src.domain.partner.dtos.retrieve_cashier_profile_dtos import OutputDto as RetrieveCashierOutputDto

from src.domain.partner.models.bank_account import BankName
from src.domain.partner.models.branch import  Branch
from src.app.web.partner.controllers.retrieve_partner_user_profiles_controller import (
    RetrievePartnerUserProfilesController,
)
from src.domain.partner.dtos.retrieve_top_partner_dto import RetrieveTopPartnersOutputDto
from src.domain.partner.dtos.disburse_payment_dtos import DisbursePaymentOutputDto
from src.app.web.partner.controllers.update_user_profile_controller import UpdateUserProfileController
from src.app.web.partner.routes.validations.retrieve_partner_cashiers_params import RetrievePartnerCashiersParams
from src.app.web.partner.routes.validations.update_user_profile_validator import UpdateUserProfileValidator
from src.domain.partner.dtos.retrieve_user_profile_dtos import RetrieveUserProfilesOutputDto
from src.domain.partner.models.partner import Partner, PartnerCategory
from src.domain.partner.models.user_profile import ProfileType, UserProfile, UserProfileState
from sanic import Blueprint, Request
from sanic_ext import validate, openapi
from uuid import UUID
from src.app.web.partner.controllers.retrieve_partner_controller import RetrievePartnerController
from src.app.web.partner.controllers.retrieve_top_partners_controller import RetrieveTopPartnersController
from src.app.web.partner.controllers.create_partner_controller import CreatePartnerController
from src.app.web.partner.controllers.create_partner_branch_controller import CreatePartnerBranchController
from src.app.web.partner.controllers.create_user_profile_controller import CreateUserProfileController
from src.app.web.partner.controllers.create_branch_manager_user_profile_controller import (
    CreateBranchManagerUserProfileController)
from src.app.web.partner.controllers.reset_user_password_controller import ResetUserPasswordController
from src.app.web.partner.controllers.retrieve_all_partners_controller import RetrieveAllPartnersController
from src.app.web.partner.controllers.disburse_payment_controller import DisbursePaymentController
from src.app.web.partner.routes.validations.create_partner_validator import (
    CreatePartnerValidator,
    PartnerBranchValidator,
)
from src.app.web.partner.routes.validations.create_cashier_validator import CreateCashierValidator
from src.app.web.partner.routes.validations.create_branch_manager_validator import CreateBranchManagerValidator
from src.app.web.partner.routes.validations.reset_user_password_validator import ResetUserPasswordValidator
from src.utils.web import GenericWebError

partners_blueprint = Blueprint("partners", url_prefix="/partners", version=1)


# POST - /v1/partners/
@partners_blueprint.post("")
@openapi.summary("Create partner")
@openapi.body(
    {
        "application/json": {
            "name": str,
            "categories": list[PartnerCategory],
            "tax_registration_number": str,
            "commercial_registration_number": str,
            "admin_user_profile": {
                "first_name": str,
                "last_name": str,
                "email": str,
                "phone_number": str,
            },
            "bank_account": {
                "bank_name": BankName,
                "branch_name": str,
                "beneficiary_name": str,
                "iban": str,
                "swift_code": str,
                "account_number": str,
            },
        }
    }
)
@openapi.response(201, {"application/json": Partner})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=CreatePartnerValidator)
def create_partner(request, body: CreatePartnerValidator):
    controller = CreatePartnerController(request.json)
    result = controller.execute()
    return result


# POST - /v1/partners/{id}
@partners_blueprint.post("<id:str>/branches")
@openapi.summary("Create partner branch")
@openapi.body(
    {
        "application/json": {
            "governorate_id": int,
            "name": str,
            "city_id": int,
            "area_id": int,
            "area": str,
            "street": str,
            "location": {"latitude": str, "longitude": str},
            "google_maps_link": str,
        }
    }
)
@openapi.response(201, {"application/json": Branch})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=PartnerBranchValidator)
def create_partner_branch(request, id: UUID, body: PartnerBranchValidator):
    controller = CreatePartnerBranchController(id, request.json)
    result = controller.execute()
    return result


# GET - /v1/partners/
@partners_blueprint.get("")
@openapi.summary("Get all partners")
@openapi.response(200, {"application/json": [Partner]})
@openapi.response(400, {"application/json": GenericWebError})
def retrieve_all_partners(request):
    controller = RetrieveAllPartnersController()
    result = controller.execute()
    return result


# GET - /v1/partners/top
@partners_blueprint.get("top")
@openapi.summary("Get top partners")
@openapi.response(200, {"application/json": [RetrieveTopPartnersOutputDto]})
@openapi.response(400, {"application/json": GenericWebError})
def retrieve_top_partners(request):
    controller = RetrieveTopPartnersController()
    result = controller.execute()
    return result


# GET - /v1/partners/{id}
@partners_blueprint.get("<id:str>")
@openapi.summary("Get partner by ID")
@openapi.response(200, {"application/json": Partner})
@openapi.response(400, {"application/json": GenericWebError})
def retrieve_partner(request, id: UUID):
    controller = RetrievePartnerController(id)
    result = controller.execute()
    return result


# POST - /v1/partners/{id}/cashiers/
@partners_blueprint.post("<partner_id:str>/cashiers")
@openapi.summary("Create cashier")
@openapi.description("Phone number must start with (+2)")
@openapi.body(
    {
        "application/json": {
            "first_name": str,
            "last_name": str,
            "phone_number": str,
            "branch_id": str,
            "email": Optional[str],
        }
    }
)
@openapi.response(200, {"application/json": UserProfile})
@openapi.response(400, {"application/json": GenericWebError})
@validate(json=CreateCashierValidator)
def create_cashier(request, partner_id: UUID, body: CreateCashierValidator):
    controller = CreateUserProfileController(json_input=request.json, partner_id=partner_id)
    result = controller.execute()
    return result
# POST - /v1/partners/{id}/branch-managers/
@partners_blueprint.post("<partner_id:str>/branch-managers")
@openapi.summary("Create branch manager")
@openapi.description("Phone number must start with (+2)")
@openapi.body(
    {
        "application/json": {
            "first_name": str,
            "last_name": str,
            "phone_number": Optional[str],
            "branch_id": str,
            "email": str,
        }
    }
)
@openapi.response(200, {"application/json": UserProfile})
@openapi.response(400, {"application/json": GenericWebError})
@validate(json=CreateBranchManagerValidator)
def create_branch_manager(request, partner_id: UUID, body: CreateBranchManagerValidator):
    controller = CreateBranchManagerUserProfileController(
        json_input=request.json, partner_id=partner_id
    )
    result = controller.execute()
    return result


# GET - /v1/partners/{id}/cashiers
@partners_blueprint.get("<partner_id:str>/cashiers")
@openapi.summary("Get all partner's cashiers")
@openapi.parameter("page", int, "Page number")
@openapi.parameter("per_page", int, "Number of items per page")
@openapi.response(200, {"application/json": RetrieveUserProfilesOutputDto})
@openapi.response(400, {"application/json": GenericWebError})
@validate(query=RetrievePartnerCashiersParams)
def get_cashiers(request, partner_id: UUID):
    page = int(request.args.get("page")) if request.args.get("page") else None
    per_page = int(request.args.get("per_page")) if request.args.get("per_page") else None
    controller = RetrievePartnerUserProfilesController(
        iam_id=None, partner_id=partner_id, type=ProfileType.CASHIER.value, page=page, per_page=per_page
    )
    result = controller.execute()
    return result


# GET - /v1/partners/cashier
@partners_blueprint.get("/cashier")
@openapi.summary("Get cashiers")
@openapi.parameter("iam_id")
@openapi.response(200, {"application/json": RetrieveCashierOutputDto})
@openapi.response(400, {"application/json": GenericWebError})
@validate(query=RetrieveCashierByIamIdValidator)
def get_cashier(request, query):
    controller = RetrieveCashierProfileController(request.args.get("iam_id"))
    result = controller.execute()
    return result


# PATCH - /v1/partners/{id}/user-profiles/{user_profile_id}
@partners_blueprint.patch("<partner_id:str>/user-profiles/<user_profile_id:str>")
@openapi.summary("Update user profile")
@openapi.body({"application/json": {"state": UserProfileState}})
@openapi.response(200, {"application/json": {"success": bool}})
@openapi.response(400, {"application/json": GenericWebError})
@validate(json=UpdateUserProfileValidator)
def update_user_profile_identity(
    request: Request, partner_id: UUID, user_profile_id: UUID, body: UpdateUserProfileValidator
):
    controller = UpdateUserProfileController(partner_id, user_profile_id, request.json)
    result = controller.execute()
    return result


# POST - /v1/partners/reset-password/
@partners_blueprint.post("/reset-password")
@openapi.summary("Reset Password")
@openapi.description(
    "Send a request to reset the user password, the 'identifier' field can be an email or a phone number (must start with +2)"
)
@openapi.body({"application/json": {"identifier": str}})
@openapi.response(200, {"application/json": {"recovery_flow_id": str}})
@openapi.response(400, {"application/json": {"recovery_flow_id": str}})
@validate(json=ResetUserPasswordValidator)
def reset_password(request, body: ResetUserPasswordValidator):
    controller = ResetUserPasswordController(request.json)
    result = controller.execute()
    return result


# GET - /v1/partners/{id}/transactions
@partners_blueprint.get("<partner_id:str>/transactions")
@openapi.summary("Get Partner Transactions")
@openapi.parameter("page", schema=int)
@openapi.parameter("per_page", schema=int)
@openapi.response(200, {"application/json": {"data": [RetrieveTransactionDetailsOutputDto], "total_count": int}})
@openapi.response(400, {"application/json": GenericWebError})
def get_transactions(request, partner_id: UUID):
    page = int(request.args.get("page")) if request.args.get("page") else 1
    per_page = int(request.args.get("per_page")) if request.args.get("per_page") else 10
    controller = RetrievePartnerTransactionsController(partner_id, page, per_page)
    result = controller.execute()
    return result


# GET - /v1/partners/{partner_id}/transactions/{transaction_id}
@partners_blueprint.get("<partner_id:str>/transactions/<transaction_id:str>")
@openapi.summary("Get Transaction Details")
@openapi.response(200, {"application/json": RetrieveTransactionDetailsOutputDto})
@openapi.response(400, {"application/json": GenericWebError})
def get_transaction_details(request, partner_id: UUID, transaction_id: UUID):
    controller = RetrieveTransactionDetailsController(partner_id=partner_id, basket_id=transaction_id)
    result = controller.execute()
    return result


# POST - /v1/partners/disbursement
@partners_blueprint.post("disbursement")
@openapi.summary("Disburse partner payment")
@openapi.body({"application/json": {}})
@openapi.response(200, {"application/json": DisbursePaymentOutputDto})
@openapi.response(400, {"application/json": GenericWebError})
def disburse_payment(request):
    controller = DisbursePaymentController(request_body=request.json)
    result = controller.execute()
    return result
