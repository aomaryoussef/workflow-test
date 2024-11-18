import os
from src.services.logging import logger
from src.services.twilio import Twilio
from src.utils.notifications import Notifications
from config.settings import settings

consumer_onboarding_otp_sms_template_id = settings.get("sms_templates", default={}).get(
    "consumer_onboarding_otp", default=""
)

checkout_otp_sms_template_id = settings.get("sms_templates", default={}).get("checkout_otp", default="")

partner_reset_password_otp_sms_template_id = settings.get("sms_templates", default={}).get("partner_reset_password",
                                                                                           default="")

sms_channel = settings.get("communication_channel", default={}).get("sms", default="green_service")
logger = logger.bind(service="sms_handler", context="service", action="SMS Handler")


class SMSHandler:
    def __init__(self, phone_number):
        self.phone_number = phone_number
        self.template_mapping = {
            "consumer": {"jinja": "consumer_onboarding", "template_id": consumer_onboarding_otp_sms_template_id},
            "checkout": {"jinja": "checkout_otp", "template_id": checkout_otp_sms_template_id},
            "partner": {"jinja": "reset_pass_sms_template", "template_id": partner_reset_password_otp_sms_template_id}
        }

    def send_sms(self, otp_code, template_type, **kwargs):
        """
        Send SMS.
        :param otp_code: The OTP code.
        :param template_type: The type of the OTP. [consumer, checkout]
        """
        try:
            logger.debug(f"sending sms via channel: {sms_channel} to: {self.phone_number} with OTP: {otp_code}")
            # add OTP code to the kwargs
            kwargs.update({"OTP": otp_code})
            kwargs.update({"otp": otp_code})
            # check sms channel(default sender is green_service)
            if sms_channel == "twilio":
                self._send_via_twilio(template_type, **kwargs)
            else:
                self._send_via_green_service(template_type, **kwargs)

        except Exception as e:
            logger.error(f"error sending sms: {str(e)}")

    def _send_via_twilio(self, template_type, **kwargs):
        """
        Sends an OTP via Twilio SMS.
        :param template_type: The type of the OTP. [consumer, checkout]
        """
        template_directory = self.template_mapping.get(template_type, {}).get("jinja")  # example: consumer_onboarding
        if not template_directory:
            logger.error(f"Invalid template_type: {template_type}, must be one of [consumer, checkout]")
            raise ValueError(f"Invalid template_type: {template_type}, must be one of [consumer, checkout]")

        template_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "..", "..",
            "static", "templates", template_type, f"{template_directory}.jinja"
        )
        template_content = Notifications.render_template(template_path=template_path, **kwargs)

        if template_content is None:
            logger.error("no template content retrieved, no sms is sent")
            raise Exception("no template content retrieved, no sms is sent")

        Twilio().send_sms(to_phone_number=self.phone_number, template_content=template_content)
        logger.debug("sms via twilio sent successfully")

    def _send_via_green_service(self, template_type, **kwargs):
        """
        Sends an OTP via Green Service SMS.
        :param template_type: The type of the OTP. [consumer, checkout]
        """
        template_id = self.template_mapping.get(template_type, {}).get("template_id")  # example: UUID4 string
        if template_id is None:
            logger.error("no template_id retrieved, no sms is sent")
            raise Exception("no template_id retrieved, no sms is sent")
        # check sms channel and number is not vodafone (default sender for vodafone numbers is green_service)
        send_provider = "vodafone" if self.phone_number.startswith("+2010") else "infobip"

        Notifications.send_sms(
            template_id=template_id,
            recipient=self.phone_number,
            send_provider=send_provider,
            **kwargs,
        )
        logger.debug("sms via green_service sent successfully")
