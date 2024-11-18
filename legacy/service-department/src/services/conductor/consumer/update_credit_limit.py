import uuid
from src.domain.consumer.dtos.update_consumer_credit_limit_dto import (
    InputDto,
    OutputDto,
)
from src.domain.consumer.models.credit_limit import CreditLimitDirection

from conductor.client.worker.worker_task import worker_task
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.domain.consumer.use_cases.update_consumer_credit_limt import (
    UpdateConsumerCreditLimitUseCase,
)
from src.domain.consumer.use_cases.update_beta_consumer_credit_limit import (
    UpdateBetaConsumerCreditLimitUseCase,
)
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="update credit limit")
polling_interval = settings.get("workflow", default={}).get("polling_interval")
is_alpha_onboarding = settings.get("workflow", default={}).get("is_alpha_onboarding", default=True)


@worker_task(task_definition_name="update_credit_limit", poll_interval_millis=polling_interval * 1000)
def worker_task(
    consumer_id: str,
    amount: int,
    direction: str = CreditLimitDirection.DECREASE.value,
) -> dict:
    logger.debug("execute")
    logger.debug(f"consumer_id: {consumer_id}, amount: {amount}, direction: {direction}")

    input_dto = InputDto(
        consumer_id=uuid.UUID(consumer_id),
        amount=amount,
        direction=CreditLimitDirection(direction),
    )
    consumer_repository = ConsumerPostgresqlRepository()
    if is_alpha_onboarding:
        logger.info("Running UpdateBetaConsumerCreditLimitUseCase")
        use_case = UpdateBetaConsumerCreditLimitUseCase(
            consumer_repository=consumer_repository,
            input_dto=input_dto,
        )
    else:
        logger.info("Running UpdateConsumerCreditLimitUseCase")
        use_case = UpdateConsumerCreditLimitUseCase(
            consumer_repository=consumer_repository,
            input_dto=input_dto,
        )

    output_dto: OutputDto = use_case.execute()
    return output_dto.to_dict()
