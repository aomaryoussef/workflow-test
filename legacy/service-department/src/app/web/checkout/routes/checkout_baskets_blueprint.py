from uuid import UUID
from typing import Any, Dict
from sanic import Blueprint
from sanic_ext import validate, openapi
from src.app.web.checkout.controllers.accept_down_payment import AcceptDownPaymentController
from src.app.web.checkout.controllers.create_checkout_basket_controller import CreateCheckoutBasketController
from src.app.web.checkout.controllers.resend_checkout_otp_via_phone_call_controller import \
    ResendCheckoutOtpViaPhoneCallController
from src.app.web.checkout.controllers.retrieve_commercial_offers_controller import RetrieveCommercialOffersController
from src.app.web.checkout.controllers.select_commercial_offer_controller import SelectCommercialOfferController
from src.domain.checkout.dtos.accept_down_payment_dto import AcceptDownPaymentOutputDto
from src.domain.checkout.dtos.create_checkout_basket_dto import (
    CreateCheckoutBasketInputDto,
    CreateCheckoutBasketOutputDto,
)
from src.app.web.checkout.controllers.retrieve_checkout_basket_controller import RetrieveCheckoutBasketController
from src.app.web.checkout.routes.validations.select_commercial_offer_validator import SelectCommercialOfferValidator
from src.domain.checkout.dtos.retrieve_checkout_basket_dto import RetrieveCheckoutBasketOutputDto
from src.app.web.checkout.routes.validations.cancel_checkout_basket_validator import CancelCheckoutBasketValidator
from src.app.web.checkout.controllers.cancel_checkout_basket_controller import CancelCheckoutBasketController
from src.app.web.checkout.controllers.cancel_active_checkout_basket_controller import (
    CancelActiveCheckoutBasketController,
)
from src.app.web.checkout.controllers.verify_checkout_otp_controller import VerifyCheckoutOtpController
from src.app.web.checkout.controllers.trigger_send_otp_controller import TriggerSendOtpController
from src.app.web.checkout.controllers.resend_checkout_otp_controller import ResendCheckoutOtpController
from src.app.web.checkout.routes.validations.verify_checkout_otp_validator import VerifyCheckoutOtpValidator
from src.app.web.checkout.routes.validations.cancel_active_checkout_validator import CancelActiveCheckoutValidator
from src.app.web.checkout.controllers.get_checkout_baskets_controller import GetCheckoutBasketsController
from src.domain.checkout.dtos.get_checkout_baskets_dtos import CustomCheckoutBasket
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.utils.web import GenericWebError

checkout_baskets_blueprint = Blueprint("checkout_baskets", url_prefix="/checkout_baskets", version=1)


# /v1/checkout_baskets
@checkout_baskets_blueprint.post("/")
@openapi.summary("Create Checkout Basket")
@openapi.description(
    "This API is used to create a new checkout basket, once the checkout basket is created a new checkout workflow is triggered"
)
@openapi.response(200, {"application/json": CreateCheckoutBasketOutputDto})
@openapi.body({"application/json": CreateCheckoutBasketInputDto})
@openapi.response(404, {"application/json": {"message": str}})
def create_checkout_basket(request):
    controller = CreateCheckoutBasketController(checkout_basket=request.json)
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/commercial-offers
@checkout_baskets_blueprint.get("<session_basket_id>/commercial-offers")
@openapi.summary("Get Commercial offers")
@openapi.description(
    "This API is used to return a list of commercial offers generated for the associated checkout basket"
)
@openapi.response(200, {"application/json": list[Dict[str, Any]]})
@openapi.response(404, {"application/json": {"message": str}})
def get_commercial_offers(_, session_basket_id: str):
    controller = RetrieveCommercialOffersController(session_basket_id)
    result = controller.execute()
    return result


# GET: /v1/checkout_basket/:session_basket_id
@checkout_baskets_blueprint.get("<session_basket_id>")
@openapi.summary("get checkout basket")
@openapi.description("This API is used to the checkout basket by its id")
@openapi.response(
    200,
    {"application/json": {"data": RetrieveCheckoutBasketOutputDto}},
)
@openapi.response(404, {"application/json": {"message": str}})
def get_checkout_basket(_, session_basket_id: str):
    controller = RetrieveCheckoutBasketController(session_basket_id)
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/commercial-offers/select
@checkout_baskets_blueprint.post("<session_basket_id>/commercial-offers/select")
@openapi.summary("Select Commercial offers")
@openapi.description(
    "This API is used to update the checkout basket with the selected commercial offer by the consumer"
)
@openapi.body({"application/json": {"selected_offer_id": str}})
@openapi.response(200, {"application/json": Dict[str, Any]})
@openapi.response(400, {"application/json": {"message": str}})
@validate(json=SelectCommercialOfferValidator)
def select_commercial_offer(_, session_basket_id: str, body: SelectCommercialOfferValidator):
    controller = SelectCommercialOfferController(session_basket_id, body.model_dump()["selected_offer_id"])
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/verify-otp
@checkout_baskets_blueprint.post("<session_basket_id>/verify-otp")
@openapi.summary("verify checkout otp")
@openapi.description("This API is used to trigger verify checkout otp")
@openapi.body({"application/json": {"otp": str}})
@openapi.response(200, {"application/json": Dict[str, Any]})
@openapi.response(404, {"application/json": {"message": str}})
@validate(json=VerifyCheckoutOtpValidator)
def verify_checkout_otp(_, session_basket_id: str, body: VerifyCheckoutOtpValidator):
    controller = VerifyCheckoutOtpController(session_basket_id, body.model_dump()["otp"])
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/send-otp
@checkout_baskets_blueprint.get("<session_basket_id>/send-otp")
@openapi.summary("trigger checkout send otp")
@openapi.description("This API is used to trigger send checkout otp")
@openapi.response(200, {"application/json": Dict[str, Any]})
@openapi.response(404, {"application/json": {"message": str}})
def send_checkout_otp(_, session_basket_id: str):
    controller = TriggerSendOtpController(session_basket_id)
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/resend-otp
@checkout_baskets_blueprint.get("<session_basket_id>/resend-otp")
@openapi.summary("trigger checkout resend otp")
@openapi.description("This API is used to resend checkout otp")
@openapi.response(200, {"application/json": Dict[str, Any]})
@openapi.response(404, {"application/json": {"message": str}})
def resend_checkout_otp(_, session_basket_id: str):
    controller = ResendCheckoutOtpController(session_basket_id)
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/resend-otp/callme
@checkout_baskets_blueprint.get("<session_basket_id>/resend-otp/callme")
@openapi.summary("trigger checkout resend otp via phone call")
@openapi.description("This API is used to resend checkout otp via phone call")
@openapi.response(200, {"application/json": Dict[str, Any]})
@openapi.response(404, {"application/json": {"message": str}})
def resend_checkout_otp_voice(_, session_basket_id: str):
    controller = ResendCheckoutOtpViaPhoneCallController(session_basket_id)
    result = controller.execute()
    return result


# /v1/checkout_baskets/{session_basket_id}/accept-down-payment
@checkout_baskets_blueprint.post("<session_basket_id>/accept-down-payment")
@openapi.summary("Accept down payment")
@openapi.description("This API is used to accept a down payment")
@openapi.response(200, {"application/json": AcceptDownPaymentOutputDto})
@openapi.response(404, {"application/json": {"message": str}})
def accept_down_payment(_, session_basket_id: str):
    controller = AcceptDownPaymentController(session_basket_id)
    result = controller.execute()
    return result


# POST: /v1/checkout_baskets/{session_basket_id}/cancel
@checkout_baskets_blueprint.post("<session_basket_id>/cancel")
@openapi.summary("cancel checkout basket")
@openapi.body({"application/json": {"status": str}})
@openapi.response(200, {"application/json": {"data": {"status": str}}})
@openapi.response(404, {"application/json": {"message": str}})
@validate(json=CancelCheckoutBasketValidator)
def cancel(_, session_basket_id: str, body: CancelCheckoutBasketValidator):
    controller = CancelCheckoutBasketController(session_basket_id, body.model_dump()["status"])
    result = controller.execute()
    return result


@checkout_baskets_blueprint.delete("/")
@openapi.summary("cancel active checkout")
@openapi.description("cancel active checkout for a consumer")
@openapi.parameter(name="consumer_phone_number", schema=str, location="query")
@openapi.response(204, {})
@validate(query=CancelActiveCheckoutValidator)
def cancel_active_checkout(request, query):
    consumer_phone_number = request.args.get("consumer_phone_number", "")
    controller = CancelActiveCheckoutBasketController(consumer_phone_number)
    result = controller.execute()
    return result


# GET: /v1/checkout_baskets
@checkout_baskets_blueprint.get("/")
@openapi.summary("get checkout baskets")
@openapi.description("This API is used to get checkout baskets with optional filters")
@openapi.parameter(name="statuses", schema=list[CheckoutBasketStatus], location="query")
@openapi.parameter(name="consumer_id", schema=UUID, location="query")
@openapi.response(200, {"application/json": list[CustomCheckoutBasket]})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(404, {"application/json": GenericWebError})
def get_consumer_checkout_baskets(request):
    statuses = request.args.getlist("statuses", [CheckoutBasketStatus.LOAN_ACTIVATED])
    consumer_id = request.args.get("consumer_id", None)
    controller = GetCheckoutBasketsController(consumer_id=consumer_id, statuses=statuses)
    result = controller.execute()
    return result
