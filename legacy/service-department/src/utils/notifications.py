import boto3
import smtplib
from botocore.exceptions import ClientError
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from config.settings import settings
from jinja2 import Template
import requests
from src.services.logging import logger

use_test_data = settings.get("app", default={}).get("use_test_data", default=False)

mail_method = settings.get("Mail", default={}).get("method", "")
smtp_server = settings.get("Mail", default={}).get("server", "")
smtp_port = settings.get("Mail", default={}).get("port", 587)
sender_name = settings.get("Mail", default={}).get("sender_name")
sender_email = settings.get("Mail", default={}).get("sender_email")
sender_password = settings.get("Mail", default={}).get("sender_pass")

aws_region = settings.get("aws", default={}).get("region", "us-east-1")

notification_base_url = settings.get("green_service", default={}).get("base_url", default="")
phone_safe_list = settings.get("dev_only", default={}).get("phone_numbers_safe_list", default=[])
notification_api_key = settings.get("green_service", default={}).get("api_key", default="")

twilio_template_id = settings.get("twilio", default={}).get("template_id", default="")

logger = logger.bind(service="notifications", context="setup", action="setup")


class Notifications:
    @staticmethod
    def render_template(template_path, **kwargs):
        logger.debug("rendering template: %s" % template_path)
        try:
            with open(template_path) as file_:
                template = Template(file_.read())
            return template.render(**kwargs)
        except Exception as e:
            logger.error(f"Unable to render template: {e}")
            return None

    @staticmethod
    def send_email(recipient, subject, body):
        char_set = "utf-8"
        match mail_method:
            case "smtp":
                logger.debug("send smtp email to: %s" % recipient)
                msg = MIMEMultipart()
                msg["From"] = sender_email
                msg["To"] = recipient
                msg["Subject"] = Header(subject, char_set)
                msg.attach(MIMEText(body, "html", char_set))

                with smtplib.SMTP(smtp_server, smtp_port, timeout=3) as server:
                    try:
                        server.starttls()
                    except Exception as e:
                        logger.error(f"Unable to start Email connection in TLS: {e}")
                        # Probably a local or testing server, skip error and attempt to connect anyways
                        pass
                    server.login(sender_email, sender_password)
                    server.sendmail(sender_email, recipient, msg.as_string())
            case "ses":
                boto_client = boto3.client(mail_method, region_name=aws_region)

                try:
                    response = boto_client.send_email(
                        Destination={
                            "ToAddresses": [
                                recipient,
                            ],
                        },
                        Message={
                            "Body": {
                                "Html": {
                                    "Charset": char_set,
                                    "Data": body,
                                },
                            },
                            "Subject": {
                                "Charset": char_set,
                                "Data": subject,
                            },
                        },
                        Source=f"{sender_name} <{sender_email}>",
                    )
                except ClientError as e:
                    logger.error(f"Unable to send ses email: {e.response['Error']['Message']}")
                else:
                    logger.debug(f"Email sent! Message ID: {response['MessageId']}"),
            case _:
                logger.error(f"Invalid mail method: {mail_method}, not sending an email")

    @staticmethod
    def send_sms(
        template_id: str, recipient: str, send_provider: str = "vodafone", **kwargs
    ):
        logger.debug("send sms to: %s" % recipient)
        try:
            phone_number = recipient[2:] if recipient.startswith("+2") else recipient
            logger.debug("SMS parameters are: %s" % str(kwargs))

            if use_test_data and phone_number not in phone_safe_list:
                return
            request_body = {
                "channel": "sms",
                "priority": 1,
                "sender": "mylo",
                "recipient_list": phone_number,
                "template_id": template_id,
                "send_provider": send_provider,
                "template_parameters": kwargs,
            }
            logger.debug("SMS parameters are: %s" % request_body)
            response = requests.post(
                url=notification_base_url + "/api/v1/notifications/send",
                json=request_body,
                verify=False,
                headers={
                    "Content-Type": "application/json",
                    "accept": "application/json",
                    "API-Key": notification_api_key,
                },
                timeout=5,
            )

            if response.status_code != 201:
                logger.error("An error occurred send sms with status code : %s" % str(response.status_code))
            else:
                logger.debug("send sms response: %s" % response.text)
                return response.text
        except Exception as expt:
            logger.error("An error occurred send sms: %s" % str(expt))
