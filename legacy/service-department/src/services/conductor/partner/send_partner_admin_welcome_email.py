import os
from conductor.client.worker.worker_task import worker_task
from src.utils.kratos import Kratos
from src.services.logging import logger
from src.utils.notifications import Notifications
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner bank account")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="send_partner_admin_welcome_email", poll_interval_millis=polling_interval * 1000)
def send_partner_admin_welcome_email(
    iam_id: str,
    partner_id: str,
    first_name: str,
    email: str,
) -> dict:
    logger.info("worker started")
    logger.debug(f"iam_id {iam_id}, partner_id {partner_id}, first_name {first_name}, email {email}")

    try:
        base_url = settings.get("BFF", default={}).get("base_url", default="")
        recovery_dict = Kratos.create_recovery_code(iam_id)
        recovery_link = (
            f"{base_url}/public/partner/set-first-password?"
            f"recovery_flow_id={recovery_dict.get('flow_id')}&"
            f"recovery_code={recovery_dict.get('recovery_code')}&"
            f"partner_id={partner_id}"
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
            "welcome_email_template.html",
        )
        email_subject = "آهلا بيك في مايلو"
        email_body = Notifications.render_template(
            template_path=template_path, name=first_name, recovery_link=recovery_link
        )
        if email_body is not None:
            Notifications.send_email(recipient=email, subject=email_subject, body=email_body)
        else:
            logger.error("Unable to send welcome email")
    except Exception as e:
        logger.error(f"Unable to send email: {e}")

    return {}
