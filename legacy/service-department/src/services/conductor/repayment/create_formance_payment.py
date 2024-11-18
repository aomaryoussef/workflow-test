import dateutil.parser
from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.domain.registry.use_cases.create_formance_payment import InputDto, OutputDto, CreateFormancePaymentUseCase
from src.utils.exceptions import ResourceNotCreatedException
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create formance payment")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_formance_payment", poll_interval_millis=polling_interval * 1000)
def worker_task(
    payment_channel: str, amount: int, created_at: str, reference: str, workflow_id: str, metadata: dict
) -> dict:
    logger.info("worker started")
    metadata["workflowId"] = workflow_id
    input_dto = InputDto(
        payment_channel=payment_channel,
        amount=amount,
        created_at=dateutil.parser.isoparse(created_at),
        reference=reference,
        metadata=metadata,
    )
    use_case = CreateFormancePaymentUseCase(input_dto)
    try:
        output_dto: OutputDto = use_case.execute()
        return output_dto.to_dict()
    except ResourceNotCreatedException as exception:
        error_message = f"ResourceNotCreatedException: {exception}"
        logger.error(error_message)
        raise NonRetryableException(error_message)
