from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.dtos.update_checkout_basket_status_dto import UpdateCheckoutBasketStatusInputDto
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.update_checkout_basket_status import UpdateCheckoutBasketStatusUseCase
from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings


logger = logger.bind(service="conductor", context="worker", action="update checkout basket status")
polling_interval = settings.get("workflow", default={}).get("polling_interval", default=5)


class UpdateCheckoutBasketStatus(WorkerInterface):
    def __init__(self):
        super(UpdateCheckoutBasketStatus, self).__init__(task_definition_name="update_checkout_basket_status")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logs = ["execute"]
        try:
            workflow_id = task.workflow_instance_id
            checkout_basket_status = task.input_data["status"]
            if task.input_data.get("parent_workflow_id"):
                workflow_id = task.input_data["parent_workflow_id"]
            input_dto = UpdateCheckoutBasketStatusInputDto(
                checkout_basket_status,
                workflow_id,
            )
            use_case = UpdateCheckoutBasketStatusUseCase(CheckoutBasketPostgresqlRepository(), input_dto)
            result = use_case.execute()
            if result is None:
                task_result = self.get_task_result_from_task(task)
                task_result.status = TaskResultStatus.FAILED
                logger.error("result from UpdateCheckoutBasketStatusUseCase is None")
                logs.append("result from UpdateCheckoutBasketStatusUseCase is None")
                task_result.logs = logs
                return task_result
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.COMPLETED
            task_result.logs = logs
            return task_result
        except Exception as expt:
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.FAILED_WITH_TERMINAL_ERROR
            logger.error("An error occurred: %s" % str(expt))
            logs.append("An error occurred: %s" % str(expt))
            task_result.logs = logs
            return task_result

    def get_polling_interval_in_seconds(self) -> float:
        return polling_interval
