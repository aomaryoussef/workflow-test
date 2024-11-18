from src.domain.consumer.dtos.resend_consumer_recovery_code_voice_call_dto import (
    ResendConsumerRecoveryCodeVoiceCallOutputDto,
)
from src.services.twilio import Twilio
from src.utils.kratos import Kratos
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="resend recovery code")


class ResendConsumerRecoveryCodeViaPhoneCallUseCase:
    def __init__(self, phone_number: str):
        self.iam = Kratos
        self.phone_number = phone_number if phone_number.startswith("+2") else "+2" + phone_number

    def execute(self):
        try:
            identity = self.iam.get_identity_by_identifier(self.phone_number)
            if identity is None:
                logger.debug("Didn't find identity in IAM")
                return None
            identity_id = identity["id"]
            response = self.iam.create_recovery_code(identity_id)
            if response is None:
                logger.error("Failed to create recovery code with response %s" % str(response))
                raise Exception("Cant create recovery code")
            flow_id = response["flow_id"]
            recovery_code: str = response["recovery_code"]
            try:
                Twilio().trigger_voice_call(
                    otp_type="onboarding",
                    to_phone_number=self.phone_number,
                    otp_code=recovery_code
                )
            except Exception as e:
                # don't block the request if the sms sending failed
                logger.error("error triggering voice call: {}".format(str(e)))
            logger.debug("recovery code voice call triggered to %s" % self.phone_number)
            return ResendConsumerRecoveryCodeVoiceCallOutputDto(identity_id, flow_id)
        except Exception as expt:
            logger.error("Failed to create identity recovery code: {}".format(str(expt)))
            raise Exception("Failed to create identity recovery code: {}".format(str(expt)))
