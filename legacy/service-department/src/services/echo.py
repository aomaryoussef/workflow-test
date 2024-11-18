from uuid import UUID
from config.settings import settings
from src.services.logging import logger
import requests

echo_base_url = settings.get("echo_service", default={}).get("base_url", default="")
echo_api_key = settings.get("echo_service", default={}).get("api_key", default="")
phone_safe_list = settings.get("dev_only", default={}).get("phone_numbers_safe_list", default=[])
use_test_data = settings.get("app", default={}).get("use_test_data", default=False)

logger = logger.bind(service="echo", context="setup", action="setup")


class Echo:
    @staticmethod
    def send_otp(user_id: UUID, template_id: str, recipient: str, **kwargs):
        try:
            recipient = recipient[2:] if recipient.startswith("+2") else recipient
            if use_test_data and recipient not in phone_safe_list:
                return
            request_body = {
                "channel": "sms",
                "recipient": recipient,
                "template_id": template_id,
                "template_otp_parameter_name": "OTP",
                "template_parameters": kwargs,
                "user_id": user_id,
            }
            logger.info("otp parameters are: %s" % request_body)
            response = requests.post(
                url=echo_base_url + "/api/v1/otp/send",
                json=request_body,
                verify=False,
                headers={
                    "Content-Type": "application/json",
                    "accept": "application/json",
                    "API-Key": echo_api_key,
                },
                timeout=5,
            )

            if response.status_code != 201:
                logger.error("An error occurred send otp with status code : %s" % str(response.status_code))
                logger.info("failure send otp response: %s" % response.text)
                raise Exception(response.text)

            logger.info("send otp response: %s" % response.text)
            return response.text
        except Exception as expt:
            logger.error("An error occurred send otp: %s" % str(expt))
            raise expt

    @staticmethod
    def generate_otp(user_id: str, recipient: str) -> dict or None:
        try:
            recipient = recipient[2:] if recipient.startswith("+2") else recipient
            if use_test_data and recipient not in phone_safe_list:
                return "123456"
            request_body = {
                "user_id": user_id,
            }
            logger.info("otp parameters are: %s" % request_body)
            response = requests.post(
                url=echo_base_url + "/api/v1/otp/generate",
                json=request_body,
                verify=False,
                headers={
                    "Content-Type": "application/json",
                    "accept": "application/json",
                    "API-Key": echo_api_key,
                },
                timeout=5,
            )

            if response.status_code != 201:
                logger.error(
                    "An error occurred generating otp from ECHO with status code : %s" % str(response.status_code)
                )
                logger.info("failure generating otp from ECHO, response: %s" % response.text)
                raise Exception(response.text)

            logger.info("generate otp from ECHO response: %s" % response.text)
            # example of response {"otp": "123456"}
            return response.json()["otp"]
        except Exception as expt:
            logger.error("An error occurred generating otp from ECHO: %s" % str(expt))
            raise expt

    @staticmethod
    def verify_otp(otp_code: str, user_id: UUID):
        if use_test_data and otp_code == "123456":
            return "VERIFIED"
        try:
            request_body = {"otp_code": otp_code, "user_id": str(user_id)}
            logger.debug("verify otp parameters are: %s" % request_body)
            response = requests.post(
                url=echo_base_url + "/api/v1/otp/verify",
                json=request_body,
                verify=False,
                headers={
                    "Content-Type": "application/json",
                    "accept": "application/json",
                    "API-Key": echo_api_key,
                },
                timeout=5,
            )

            if response.status_code == 400:
                logger.error("OTP Not Verified")
                raise Exception("OTP Not Verified")
            if response.status_code != 200:
                logger.error("An error occurred verify otp with status code : %s" % str(response.status_code))
                raise Exception(response.text)

            logger.debug("verify otp response: %s" % response.text)
            return "VERIFIED"
        except Exception as expt:
            logger.error("An error occurred verify otp: %s" % str(expt))
            raise expt
