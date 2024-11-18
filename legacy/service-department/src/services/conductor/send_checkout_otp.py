from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.use_cases.send_checkout_otp import SendCheckoutOtpUseCase
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository

from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="send checkout otp")
polling_interval = settings.get("workflow", default={}).get("polling_interval", default=5)


class SendCheckoutOtp(WorkerInterface):
    def __init__(self):
        super(SendCheckoutOtp, self).__init__(task_definition_name="send_otp")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logs = ["execute"]
        try:
            logger.info("1- execute worker")
            checkout_otp_body = {
                "consumer_id": task.input_data["consumer_id"],
                "partner_id": task.input_data["partner_id"],
                "monthly_installment": task.input_data["monthly_installment"] / 100,
                "num_of_months": task.input_data["num_of_months"].split("_")[0],
                "total_amount": int(task.input_data["num_of_months"].split("_")[0])
                * int(task.input_data["monthly_installment"])
                / 100,
                "admin_fee": task.input_data["admin_fee"] / 100,
                "down_payment": task.input_data["down_payment"] / 100,
                "total_fees": (int(task.input_data["admin_fee"]) + int(task.input_data["down_payment"])) / 100,
            }
            use_case = SendCheckoutOtpUseCase(
                consumer_repository=ConsumerPostgresqlRepository(),
                partner_repository=PartnerRepository(),
                checkout_otp_body=checkout_otp_body,
            )
            logger.info("2- use case created")
            use_case.execute()
            logger.info("3- use case executed")
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.COMPLETED
            task_result.logs = logs
            logger.info("4- results set to task")
            return task_result
        except Exception as expt:
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.FAILED
            logger.error("An error occurred sending consumer SMS: %s" % str(expt))
            logs.append("An error occurred sending consumer SMS: %s" % str(expt))
            task_result.logs = logs
            logger.info("4- results set to task")
            return task_result

    def get_polling_interval_in_seconds(self) -> float:
        return polling_interval
