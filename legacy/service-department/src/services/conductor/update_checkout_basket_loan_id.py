from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.dtos.update_checkout_basket_loan_id_dto import UpdateCheckoutBasketLoanIdInputDto
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.update_checkout_basket_loan_id import UpdateCheckoutBasketLoanIdUseCase
from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="update checkout basket loan id")
polling_interval = settings.get("workflow", default={}).get("polling_interval", default=5)


class UpdateCheckoutBasketLoanId(WorkerInterface):
    def __init__(self):
        super(UpdateCheckoutBasketLoanId, self).__init__(task_definition_name="update_checkout_basket_loan_id")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logs = ["execute"]
        try:
            input_dto = UpdateCheckoutBasketLoanIdInputDto(
                id=task.input_data["checkout_basket_id"], loan_id=task.input_data["loan_id"]
            )
            use_case = UpdateCheckoutBasketLoanIdUseCase(CheckoutBasketPostgresqlRepository(), input_dto)
            result = use_case.execute()
            if result is None:
                task_result = self.get_task_result_from_task(task)
                task_result.status = TaskResultStatus.FAILED
                logger.error("result from UpdateCheckoutBasketLoanIdUseCase is None")
                logs.append("result from UpdateCheckoutBasketLoanIdUseCase is None")
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
