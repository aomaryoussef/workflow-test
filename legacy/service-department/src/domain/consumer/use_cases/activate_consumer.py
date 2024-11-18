from config.settings import settings
from src.domain.consumer.dtos.activate_consumer_dtos import InputDto, OutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.utils.notifications import Notifications
from src.services.workflow import Workflow
from src.services.logging import logger
from src.utils.exceptions import FailedToProcessRequestException

consumer_welcome_sms_template_id = settings.get("sms_templates", default={}).get(
    "consumer_onboarding_welcome", default=""
)

logger = logger.bind(service="consumer", context="use case", action="activate consumer")


class ActivateConsumerUseCase:
    def __init__(self, repository: ConsumerRepositoryInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        self.repository.create_consumer_credit_limit(self.input_dto.consumer_id, self.input_dto.credit_limit)
        consumer = self.repository.activate_consumer(self.input_dto.consumer_id, self.input_dto.credit_officer_iam_id, self.input_dto.branch_name)
        if consumer is None:
            logger.error("Unable to save consumer DB record")
            raise FailedToProcessRequestException("Failed to activate consumer")
        Workflow.activate_consumer(str(self.input_dto.consumer_id))
        Notifications.send_sms(consumer_welcome_sms_template_id, consumer.phone_number)
        return OutputDto(consumer=consumer)
