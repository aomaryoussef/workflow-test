from src.app.web.partner.controllers.retrieve_partner_user_profiles_controller import (
    RetrievePartnerUserProfilesController,
)
from src.domain.partner.dtos.retrieve_user_profile_dtos import RetrieveUserProfilesOutputDto
from sanic import Blueprint
from sanic_ext import openapi

partner_users_blueprint = Blueprint("partner-users", url_prefix="/partner-users", version=1)


# GET - /v1/partner-users/
@partner_users_blueprint.get("")
@openapi.summary("Get all users")
@openapi.parameter("iam_id", str, "IAM ID")
@openapi.response(200, {"application/json": RetrieveUserProfilesOutputDto})
def retrieve_all_users(request):
    controller = RetrievePartnerUserProfilesController(iam_id=request.args.get("iam_id", None))
    result = controller.execute()
    return result
