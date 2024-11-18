from datetime import datetime, timedelta
from src.services.logging import logger
from src.domain.registry.dtos.send_payment_reminders_dtos import InputDto, OutputDto
from src.services.hasura import Hasura
from src.utils.notifications import Notifications
from config.settings import settings

logger = logger.bind(service="registry", context="use case", action="send payment reminders")

due_today_sms_template_id = settings.get("sms_templates", default={}).get("due_today", default="")
due_four_days_ago_sms_template_id = settings.get("sms_templates", default={}).get("due_four_days_ago", default="")
due_twenty_one_days_ago_sms_template_id = settings.get("sms_templates", default={}).get(
    "due_twenty_one_days_ago", default=""
)


class SendPaymentRemindersUseCase:
    def __init__(self, input_dto: InputDto):
        self.input_dto = input_dto

    def __process_due_payments(self, due_payments, template_id):
        for due_payment in due_payments:
            consumer_phone_number = due_payment["loan"]["consumer"]["phone_number"]
            Notifications.send_sms(
                template_id=template_id,
                recipient=consumer_phone_number,
                consumer_name="",
            )

    def execute(self) -> OutputDto:
        logger.debug("execute")

        today = datetime.now()
        date_4_days_ago = today - timedelta(days=4)
        date_21_days_ago = today - timedelta(days=21)

        due_today = Hasura.fetch_due_payments_info(target_date=today.strftime("%Y-%m-%d"))
        due_4_days_ago = Hasura.fetch_due_payments_info(target_date=date_4_days_ago.strftime("%Y-%m-%d"))
        due_21_days_ago = Hasura.fetch_due_payments_info(target_date=date_21_days_ago.strftime("%Y-%m-%d"))

        # loop through the due payments and send reminders
        self.__process_due_payments(due_payments=due_today, template_id=due_today_sms_template_id)
        self.__process_due_payments(due_payments=due_4_days_ago, template_id=due_four_days_ago_sms_template_id)
        self.__process_due_payments(due_payments=due_21_days_ago, template_id=due_twenty_one_days_ago_sms_template_id)

        output_dto: OutputDto = OutputDto(
            number_of_due_today=len(due_today),
            number_of_due_4_days_ago=len(due_4_days_ago),
            number_of_due_21_days_ago=len(due_21_days_ago),
        )
        return output_dto
