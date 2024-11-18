from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ResendConsumerRecoveryCodeViaPhoneCallView
from src.domain.consumer.use_cases.resend_consumer_recovery_via_phone_call import \
    ResendConsumerRecoveryCodeViaPhoneCallUseCase
from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="resend recovery code via phone call")


class ResendConsumerRecoveryCodeViaPhoneCallController(BaseController):
    def __init__(self, phone_number: str):
        super().__init__(BaseDB=BaseDBModel)
        self.phone_number = phone_number

    def execute(self):
        """Execute the resend recovery code"""
        logger.debug("execute")
        try:
            use_case = ResendConsumerRecoveryCodeViaPhoneCallUseCase(self.phone_number)
            output_dto = use_case.execute()
            if output_dto is None:
                return ResendConsumerRecoveryCodeViaPhoneCallView.show_error(
                    "Unable to resend recovery code via phone call")
            return ResendConsumerRecoveryCodeViaPhoneCallView.show(output_dto)
        except Exception as exception:
            logger.error("Consumer recovery code not sent with exception %s" % str(exception))
            return ResendConsumerRecoveryCodeViaPhoneCallView.show_error(exception)
