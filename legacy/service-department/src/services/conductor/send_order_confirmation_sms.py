from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.send_confirmation_sms import SendConfirmationSmsUseCase
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository
from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="send confirmation sms")
polling_interval = settings.get("workflow", default={}).get("polling_interval", default=5)


class SendOrderConfirmationSms(WorkerInterface):
    def __init__(self):
        super(SendOrderConfirmationSms, self).__init__(task_definition_name="send_consumer_confirmation_sms")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logs = ["execute"]
        try:
            workflow_id = task.workflow_instance_id
            use_case = SendConfirmationSmsUseCase(
                CheckoutBasketPostgresqlRepository(),
                ConsumerPostgresqlRepository(),
                PartnerRepository(),
                workflow_id,
            )
            use_case.execute()
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.COMPLETED
            task_result.logs = logs
            return task_result
        except Exception as expt:
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.FAILED
            logger.error("An error occurred sending consumer SMS: %s" % str(expt))
            logs.append("An error occurred sending consumer SMS: %s" % str(expt))
            task_result.logs = logs
            return task_result

    def get_polling_interval_in_seconds(self) -> float:
        return polling_interval
