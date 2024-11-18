from ulid import ULID
from uuid import UUID
from sanic import Blueprint
from sanic_ext import validate, openapi
from src.app.web.registry.controllers.create_btech_payment_controller import CreateBTechPaymentController
from src.app.web.registry.controllers.create_fawry_payment_controller import CreateFawryPaymentController
from src.app.web.registry.controllers.settle_btech_loan_controller import SettleBTechLoanController
from src.app.web.registry.controllers.retrieve_payments_controller import RetrievePaymentsController
from src.app.web.registry.controllers.retrieve_payment_controller import RetrievePaymentController
from src.app.web.registry.controllers.update_payment_controller import UpdatePaymentController
from src.app.web.registry.controllers.send_payment_reminders_controller import SendPaymentRemindersController
from src.app.web.registry.routes.validations.create_btech_payment_validator import CreateBTechPaymentValidator
from src.app.web.registry.routes.validations.create_fawry_payment_validator import CreateFawryPaymentValidator
from src.app.web.registry.routes.validations.settle_btech_loan_validator import SettleBTechLoanValidator
from src.app.web.registry.routes.validations.update_payment_validator import UpdatePaymentValidator
from src.app.web.registry.routes.validations.retrieve_payments_validator import RetrievePaymentsValidator
from src.domain.registry.models.payment import Payment, PayeeType, PaymentStatus
from src.domain.registry.dtos.send_payment_reminders_dtos import OutputDto as SendPaymentRemindersOutputDto
from src.utils.web import GenericWebError

registry_blueprint = Blueprint("registry", url_prefix="/registry")


# POST - /registry/btech/payments
@registry_blueprint.post("/btech/payments")
@openapi.summary("Create a B.Tech payment")
@openapi.body(
    {
        "application/json": {
            "branch_id": str,
            "collection_agent_email": str,
            "payee_id": UUID,
            "payee_type": PayeeType,
            "loan_id": UUID,
            "loan_scheduel_id": int,
            "amount_units": int,
        }
    }
)
@openapi.response(201, {"application/json": Payment})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=CreateBTechPaymentValidator)
def create_btech_payment(request, body: CreateBTechPaymentValidator):
    controller = CreateBTechPaymentController(request)
    result = controller.execute()
    return result


# GET - /registry/btech/settlement
@registry_blueprint.post("/btech/settlement")
@openapi.summary("Settle a loan")
@openapi.body(
    {
        "application/json": {
            "branch_id": str,
            "collection_agent_email": str,
            "payee_id": UUID,
            "payee_type": PayeeType,
            "loan_id": UUID,
            "amount_units": int,
        }
    }
)
@openapi.response(201, {"application/json": Payment})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=SettleBTechLoanValidator)
def settle_btech_loan(request, body: SettleBTechLoanValidator):
    controller = SettleBTechLoanController(request)
    result = controller.execute()
    return result


# GET - /registry/btech/payments
@registry_blueprint.get("/btech/payments")
@openapi.summary("Get payments")
@openapi.parameter("billing_account", schema=str)
@openapi.parameter("billing_account_schedule_id", schema=int)
@openapi.response(200, {"application/json": list[Payment]})
@openapi.response(400, {"application/json": GenericWebError})
@validate(query=RetrievePaymentsValidator)
def get_btech_payments(request, query: RetrievePaymentsValidator):
    controller = RetrievePaymentsController(query)
    result = controller.execute()
    return result


# GET - /registry/btech/payments/{id}
@registry_blueprint.get("/btech/payments/<id:str>")
@openapi.summary("Get a payment")
@openapi.response(200, {"application/json": Payment})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(404, {"application/json": GenericWebError})
def get_btech_payment(_, id: ULID):
    controller = RetrievePaymentController(id)
    result = controller.execute()
    return result


# PATCH - /registry/btech/payments/{id}
@registry_blueprint.patch("/btech/payments/<id:str>")
@openapi.summary("Patch a payment")
@openapi.body({"application/json": {"status": PaymentStatus}})
@openapi.response(200, {"application/json": Payment})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=UpdatePaymentValidator)
def patch_btech_payment(_, id: ULID, body: UpdatePaymentValidator):
    controller = UpdatePaymentController(id, body)
    result = controller.execute()
    return result


# POST - /registry/reminders
@registry_blueprint.post("/payments-reminders")
@openapi.summary("Send payment reminders")
@openapi.response(200, {"application/json": SendPaymentRemindersOutputDto})
@openapi.response(400, {"application/json": GenericWebError})
def send_payment_reminders(_):
    controller = SendPaymentRemindersController()
    result = controller.execute()
    return result


# POST - /registry/fawry/payments
@registry_blueprint.post("/fawry/payments")
@openapi.summary("Create a fawry payment")
@openapi.body(
    {
        "application/json": {
            "channel_reference_id": str,
            "channel_transaction_id": str,
            "payee_id": UUID,
            "billing_account": UUID,
            "billing_account_scheduel_id": int,
            "amount_units": int,
            "created_by": str,
        }
    }
)
@openapi.response(201, {"application/json": Payment})
@openapi.response(400, {"application/json": GenericWebError})
@openapi.response(500, {"application/json": GenericWebError})
@validate(json=CreateFawryPaymentValidator)
def create_fawry_payment(request, body: CreateFawryPaymentValidator):
    controller = CreateFawryPaymentController(request)
    result = controller.execute()
    return result
