import random
from twilio.rest import Client
from config.settings import settings
from src.services.logging import logger

logger = logger.bind(service="twilio", context="setup", action="setup")

TWILIO_ACCOUNT_SID = settings.get("twilio", default={}).get("account_sid", default="")

TWILIO_AUTH_TOKEN = settings.get("twilio", default={}).get("auth_token", default="")

TWILIO_PHONE_NUMBERS = settings.get("twilio", default={}).get("from_numbers", default="")

TWILIO_FLOW_SID = settings.get("twilio", default={}).get("flow_sid", default="")


class Twilio:
    def __init__(self):
        self.client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    def _parse_otp(self, parameters):
        """
        Parses OTP digits and adds them to the parameters dictionary.
        """
        for i, digit in enumerate(parameters["otp_digits"]):
            parameters[f"otp_digits_{i}"] = digit
        del parameters["otp_digits"]
        return parameters

    def trigger_voice_call(self, otp_type: str, to_phone_number: str, otp_code: str, payload: dict = None) -> bool:
        """
        Sends an OTP via Twilio Studio flow.
        :param otp_type: The type of the OTP. (onboarding, checkout)
        :param to_phone_number: The phone number to send the OTP to.
        :param otp_code: The OTP code.
        :param payload: Additional parameters to pass to the Twilio flow.
        :return: True if the call was successfully triggered.
        :raises: Exception if an error occurred.
        """
        from_phone_number = "+" + random.choice(str(TWILIO_PHONE_NUMBERS).split(","))

        if payload is None:
            payload = {}

        parameters = {"otp_type": otp_type, "otp_digits": otp_code, **payload}
        try:
            execution = self.client.studio.v2.flows(TWILIO_FLOW_SID).executions.create(
                parameters=self._parse_otp(parameters), to=to_phone_number, from_=from_phone_number
            )
            logger.debug(f"successfully triggered voice call, execution sid: {execution.sid}")
            return True
        except Exception as err:
            logger.error(f"An error occurred triggering twilio voice call: {err}")
            raise Exception("Error triggering twilio voice call")

    def send_sms(self, to_phone_number: str, template_content: str) -> bool:
        """
        Sends an OTP via Twilio SMS.
        :param to_phone_number: The phone number to send the OTP to.
        :param template_content: The template content to be sent via sms.
        :return: True if the SMS was successfully triggered.
        :raises: Exception if an error occurred.
        """
        from_phone_number = "+" + random.choice(str(TWILIO_PHONE_NUMBERS).split(","))
        try:
            execution = self.client.api.account.messages.create(
                to=to_phone_number, from_=from_phone_number, body=template_content
            )
            logger.debug(f"sms successfully sent via twilio, execution sid: {execution.sid}")
            return True
        except Exception as err:
            logger.error(f"An error occurred triggering twilio sms sender: {err}")
            raise Exception("Error triggering twilio sms sender")
