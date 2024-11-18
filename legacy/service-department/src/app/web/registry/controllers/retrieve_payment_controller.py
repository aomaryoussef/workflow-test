from ulid import ULID
from src.services.logging import logger
from src.app.web.base.controller import BaseController
from src.domain.registry.database.pg_models import BaseDBModel
from src.app.web.registry.views.registry import RegistryViews
from src.domain.registry.repository.payment_repo_pg import PaymentRepo
from src.domain.registry.dtos.retrieve_payment_dtos import InputDto, OutputDto
from src.domain.registry.use_cases.retrieve_payment import RetrievePaymentUseCase

logger = logger.bind(service="registry", context="controller", action="retrieve payment")


class RetrievePaymentController(BaseController):
    def __init__(self, id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PaymentRepo()
        payment_id = None
        try:
            payment_id = ULID.from_str(id)
        except Exception:
            logger.error(f"Invalid ID {id}")
        self.input_dto: InputDto = InputDto(id=payment_id)

    def execute(self):
        logger.debug("execute")
        try:
            use_case = RetrievePaymentUseCase(repository=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = RegistryViews.show(output_dto=output_dto)
        except Exception as exception:
            result = RegistryViews.error(exception)
        return result
