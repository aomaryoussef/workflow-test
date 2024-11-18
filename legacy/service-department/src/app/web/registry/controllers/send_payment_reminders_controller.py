from src.services.logging import logger
from src.app.web.base.controller import BaseController
from src.app.web.registry.views.registry import RegistryViews
from src.domain.registry.dtos.send_payment_reminders_dtos import InputDto, OutputDto
from src.domain.registry.use_cases.send_payment_reminders import SendPaymentRemindersUseCase

logger = logger.bind(service="registry", context="controller", action="send payment reminders")


class SendPaymentRemindersController(BaseController):
    def __init__(self):
        self.input_dto: InputDto = InputDto()

    def execute(self):
        logger.debug("execute")
        try:
            use_case = SendPaymentRemindersUseCase(input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = RegistryViews.show(output_dto=output_dto)
        except Exception as exception:
            result = RegistryViews.error(exception)
        return result
