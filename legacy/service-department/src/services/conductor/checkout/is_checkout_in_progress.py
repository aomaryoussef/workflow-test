from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.is_checkout_in_progress import IsCheckoutInProgressUseCase
from src.domain.checkout.dtos.is_checkout_in_progress_dtos import InputDto, OutputDto
from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="is checkout running for consumer")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


class IsCheckoutInProgress(WorkerInterface):
    def __init__(self):
        super(IsCheckoutInProgress, self).__init__(task_definition_name="is_checkout_in_progress")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logs = ["execute"]
        logger.info("worker started")
        consumer_id = task.input_data["consumer_id"]
        checkout_basket_id = task.input_data["checkout_basket_id"]
        input_dto = InputDto(consumer_id=consumer_id, checkout_basket_id=checkout_basket_id)
        logger.info("received input from workflow")
        logger.info("create repository")
        repository = CheckoutBasketPostgresqlRepository()
        logger.info("repository created")
        logger.info("starting use case")
        use_case = IsCheckoutInProgressUseCase(repository=repository, input_dto=input_dto)
        output_dto: OutputDto = use_case.execute()
        logger.info("use case finished")
        logger.info("get task result from task")
        task_result = self.get_task_result_from_task(task)
        logger.info("task result done")
        task_result.output_data = output_dto.to_dict()
        logger.info("set task output")
        if output_dto.result:
            logger.debug("Checkout is already running for consumer or cashier")
            logs.append("Checkout is already running for consumer or cashier")
            logger.info("set task failure")
            task_result.status = TaskResultStatus.FAILED_WITH_TERMINAL_ERROR
            task_result.reason_for_incompletion = "A checkout already in progress for the id"
        else:
            task_result.status = TaskResultStatus.COMPLETED
        task_result.logs = logs
        return task_result

    def get_polling_interval_in_seconds(self) -> float:
        return polling_interval
