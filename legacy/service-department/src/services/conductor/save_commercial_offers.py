from conductor.client.worker.worker_interface import WorkerInterface
from conductor.client.http.models import Task, TaskResult
from src.domain.checkout.dtos.create_commercial_offers_dto import CreateCommercialOffersInputDto
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.domain.checkout.use_cases.create_commercial_offers import CreateCommercialOffersUseCase
from conductor.client.http.models.task_result_status import TaskResultStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="save commercial offers")
polling_interval = settings.get("workflow", default={}).get("polling_interval", default=5)


class SaveCommercialOffers(WorkerInterface):
    def __init__(self):
        super(SaveCommercialOffers, self).__init__(task_definition_name="save_commercial_offers")

    def execute(self, task: Task) -> TaskResult:
        logger.debug("execute")
        logger.info("1- execute worker")
        logs = ["execute"]
        try:
            commercial_offers = task.input_data["offer_details"]
            input_dto = CreateCommercialOffersInputDto(
                commercial_offers,
                task.workflow_instance_id,
            )
            use_case = CreateCommercialOffersUseCase(CheckoutBasketPostgresqlRepository(), input_dto)
            logger.info("2- use case created")
            result = use_case.execute()
            logger.info("3- use case executed")
            if result is None:
                logs.append("result from CreateCommercialOffersUseCase is None")
                task_result = self.get_task_result_from_task(task)
                task_result.status = TaskResultStatus.FAILED
                task_result.logs = logs
                return task_result
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.COMPLETED
            task_result.logs = logs
            logger.info("4- results set to task")
            return task_result
        except Exception as expt:
            logs.append("An error occurred saving commercial offers: %s" % str(expt))
            task_result = self.get_task_result_from_task(task)
            task_result.status = TaskResultStatus.FAILED_WITH_TERMINAL_ERROR
            logger.error("Save commercial offers failed with terminal error because of %s" % str(expt))
            task_result.logs = logs
            logger.info("4- results set to task")
            return task_result

    def get_polling_interval_in_seconds(self) -> float:
        return polling_interval
