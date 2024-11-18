import os
import re
import structlog

from src.domain.partner.dtos.reset_user_password_dtos import ResetUserPasswordInputDto, ResetUserPasswordOutputDto
from src.domain.partner.models.user_profile import UserProfile
from src.domain.partner.repository.repository_user_profile_interface import UserProfileRepositoryInterface
from src.services.sms_handler import SMSHandler
from src.utils.notifications import Notifications
from src.utils.kratos import Kratos
from config.settings import settings

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="reset_user_password")


class ResetUserPasswordUseCase:
    """Reset user password use case"""

    def __init__(
            self,
            user_profile_repository: UserProfileRepositoryInterface,
    ):
        self.user_profile_repository = user_profile_repository
        self.iam = Kratos

    def execute(self, input_dto: ResetUserPasswordInputDto):
        logger.debug("reset user password use case - execute")

        user_profile: UserProfile = None

        if re.search("^(\\+2)?(010|011|012|015)[0-9]{8}$", input_dto.identifier):
            identifier = input_dto.identifier if input_dto.identifier.startswith("+2") else f"+2{input_dto.identifier}"
            user_profile = self.user_profile_repository.get_by_phone_number(identifier)
            if user_profile is not None:
                iam_profile = Kratos.get_identity(identity_id=str(user_profile.iam_id))
            if user_profile is None or iam_profile is None or iam_profile["state"] != "active":
                return None
            recovery_dict = self.iam.create_recovery_code(str(user_profile.iam_id))
            try:
                # Send SMS
                # in this case, otp_code is a recovery_link, not a 6 digits code
                SMSHandler(identifier).send_sms(
                    otp_code=recovery_dict.get("recovery_code"),
                    template_type="partner"
                )
            except Exception as e:
                logger.error("error sending recovery link sms: {}".format(str(e)))
                return None

            return ResetUserPasswordOutputDto(recovery_flow_id=recovery_dict.get("flow_id"))
        else:
            user_profile = self.user_profile_repository.get_by_email(input_dto.identifier)
            if user_profile is not None:
                iam_profile = Kratos.get_identity(identity_id=str(user_profile.iam_id))
            if user_profile is None or iam_profile is None or iam_profile["state"] != "active":
                return None
            try:
                base_url = settings.get("BFF", default={}).get("base_url", default="")
                recovery_dict = self.iam.create_recovery_code(str(user_profile.iam_id))
                recovery_link = (
                    f"{base_url}/public/partner/reset-password?"
                    f"recovery_flow_id={recovery_dict.get('flow_id')}&"
                    f"recovery_code={recovery_dict.get('recovery_code')}&"
                )
                template_path = os.path.join(
                    os.path.dirname(os.path.abspath(__file__)),
                    "..",
                    "..",
                    "..",
                    "..",
                    "static",
                    "templates",
                    "partner",
                    "reset_pass_template.html",
                )
                email_subject = "تغيير كلمة المرور"
                email_body = Notifications.render_template(
                    template_path=template_path, name=user_profile.first_name, recovery_link=recovery_link
                )
                Notifications.send_email(recipient=user_profile.email, subject=email_subject, body=email_body)
            except Exception as e:
                logger.error(f"Unable to send email: {e}")
                return None

            return ResetUserPasswordOutputDto(recovery_flow_id="")
