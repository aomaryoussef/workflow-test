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

logger = logger.bind(service="registry", context="controller", action="create fawry payment")


class CreateFawryPaymentController(BaseController):
    def __init__(self, request):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PaymentRepo()
        payment_id = ULID()
        self.input_dto: InputDto = InputDto(
            id=payment_id,
            channel=PaymentChannel.FAWRY,
            channel_reference_id=request.json["channel_reference_id"],
            channel_transaction_id=request.json["channel_transaction_id"],
            payee_id=request.json["payee_id"],
            payee_type=PayeeType.CONSUMER,
            payee_id_type=PayeeIdType.GLOBAL_UID,
            billing_account=request.json["billing_account"],
            billing_account_schedule_id=request.json["billing_account_scheduel_id"],
            amount_units=request.json["amount_units"],
            booking_time=datetime.utcnow(),
            raw_request=request.json,
            created_by=request.json["created_by"],
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
