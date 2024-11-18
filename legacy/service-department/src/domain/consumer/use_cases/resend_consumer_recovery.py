from dataclasses import dataclass
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.services.sms_handler import SMSHandler
from src.utils.kratos import Kratos
from src.services.logging import logger

logger = logger.bind(service="consumer", context="use case", action="resend recovery code")


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    phone_number: str


@dataclass
class OutputDto(BaseOutputDto):
    identity_id: str
    recovery_code: str
    flow_id: str


class ResendConsumerRecoveryCodeUseCase:
    def __init__(self, input_dto: InputDto):
        self.iam = Kratos
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        try:
            identity = self.iam.get_identity_by_identifier(self.input_dto.phone_number)
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
                # Send SMS
                SMSHandler(self.input_dto.phone_number).send_sms(otp_code=recovery_code, template_type="consumer")
            except Exception as e:
                # don't block the request if the sms sending failed
                logger.error("error sending sms: {}".format(str(e)))
            return OutputDto(identity_id, recovery_code, flow_id)
        except Exception as expt:
            logger.error("Failed to create identity: {}".format(str(expt)))
            raise Exception("Failed to create identity: {}".format(str(expt)))