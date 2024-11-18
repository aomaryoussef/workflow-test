import uuid
from src.domain.consumer.dtos.get_credit_limit_dto import InputDto, OutputDto

from conductor.client.worker.worker_task import worker_task
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.domain.consumer.use_cases.get_credit_limit import GetCreditLimitUseCase
from src.domain.consumer.use_cases.get_beta_credit_limit import GetBetaCreditLimitUseCase

from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="get credit limit")
polling_interval = settings.get("workflow", default={}).get("polling_interval")
is_alpha_onboarding = settings.get("workflow", default={}).get("is_alpha_onboarding", default=True)


@worker_task(task_definition_name="get_credit_limit", poll_interval_millis=polling_interval * 1000)
def worker_task(consumer_id: str) -> dict:
    input_dto = InputDto(consumer_id=uuid.UUID(consumer_id))
    consumer_repository = ConsumerPostgresqlRepository()
    
    # Choose the appropriate use case based on the environment variable
    if is_alpha_onboarding:
        logger.info("Running GetBetaCreditLimitUseCase")
        use_case = GetBetaCreditLimitUseCase(
            consumer_repository=consumer_repository,
            input_dto=input_dto,
        )
    else:
        logger.info("Running GetCreditLimitUseCase")
        use_case = GetCreditLimitUseCase(
            consumer_repository=consumer_repository,
            input_dto=input_dto,
        )
    
    output_dto: OutputDto = use_case.execute()
    return output_dto.to_dict()
