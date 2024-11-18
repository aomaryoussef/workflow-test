from ulid import ULID
from datetime import datetime
from src.services.logging import logger
from src.app.web.base.controller import BaseController
from src.domain.registry.database.pg_models import BaseDBModel
from src.app.web.registry.views.registry import RegistryViews
from src.domain.registry.repository.payment_repo_pg import PaymentRepo
from src.domain.registry.dtos.create_payment_dtos import InputDto, OutputDto
from src.domain.registry.use_cases.create_payment import CreatePaymentUseCase
from src.domain.registry.models.payment import PaymentChannel, PayeeType, PayeeIdType
from src.utils.btech_cash_payment import cash_payment_codes

logger = logger.bind(service="registry", context="controller", action="create payment")


class SettleBTechLoanController(BaseController):
    def __init__(self, request):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PaymentRepo()
        payment_id = ULID()
        request.json["collected_by"] = request.json["collection_agent_email"].split("@")[0]
        request.json["collection_store_id"] = request.json["branch_id"]
        request.json["payment_method_code"] = cash_payment_codes[request.json["branch_id"].lower()]
        self.input_dto: InputDto = InputDto(
            id=payment_id,
            channel=PaymentChannel.BTECH_STORE,
            channel_reference_id=str(payment_id),
            channel_transaction_id=str(payment_id),
            payee_id=request.json["payee_id"],
            payee_type=PayeeType.CONSUMER,
            payee_id_type=PayeeIdType.GLOBAL_UID,
            billing_account=request.json["loan_id"],
            billing_account_schedule_id=-1,
            amount_units=request.json["amount_units"],
            booking_time=datetime.utcnow(),
            raw_request=request.json,
            created_by=request.json["collected_by"],
        )

    def execute(self):
        logger.debug("execute")
        try:
            use_case = CreatePaymentUseCase(repository=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = RegistryViews.show_created(output_dto)
        except Exception as exception:
            result = RegistryViews.error(exception)
        return result
