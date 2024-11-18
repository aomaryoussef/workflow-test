from src.services.logging import logger
from src.app.web.base.controller import BaseController
from src.domain.registry.database.pg_models import BaseDBModel
from src.app.web.registry.views.registry import RegistryViews
from src.domain.registry.repository.payment_repo_pg import PaymentRepo
from src.domain.registry.dtos.retrieve_payments_dtos import InputDto, OutputDto
from src.domain.registry.use_cases.retrieve_payments import RetrievePaymentsUseCase

logger = logger.bind(service="registry", context="controller", action="retrieve payments")


class RetrievePaymentsController(BaseController):
    def __init__(self, args):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PaymentRepo()
        self.input_dto: InputDto = InputDto(
            billing_account=args.billing_account,
            billing_account_schedule_id=args.billing_account_schedule_id,
        )

    def execute(self):
        logger.debug("execute")
        try:
            use_case = RetrievePaymentsUseCase(repository=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = RegistryViews.show(output_dto=output_dto)
        except Exception as exception:
            result = RegistryViews.error(exception)
        return result
