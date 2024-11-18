from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.use_cases.resend_consumer_recovery import (
    ResendConsumerRecoveryCodeUseCase,
    InputDto,
    OutputDto,
)
from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="resend recovery code")


class ResendConsumerRecoveryCodeController(BaseController):
    def __init__(self, phone_number: str):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto = InputDto(phone_number=phone_number if phone_number.startswith("+2") else "+2" + phone_number)

    def execute(self):
        """Execute the resend recovery code"""
        logger.debug("execute")
        try:
            use_case = ResendConsumerRecoveryCodeUseCase(self.input_dto)
            output_dto: OutputDto = use_case.execute()
            return ConsumerViews.show(output_dto)
        except Exception as exception:
            return ConsumerViews.error(exception)