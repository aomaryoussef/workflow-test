from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.use_cases.disburse_payment import DisbursePaymentUseCase
from src.services.logging import logger

logger = logger.bind(service="partner", context="controller", action="disburse payment")


class DisbursePaymentController(BaseController):
    def __init__(self, request_body: dict):
        super().__init__(BaseDB=BaseDBModel)
        self.request_body = request_body

    def execute(self):
        logger.debug("execute")
        try:
            use_case = DisbursePaymentUseCase(
                request_body=self.request_body,
            )
            output_dto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
