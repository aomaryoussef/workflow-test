from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository
from src.domain.partner.use_cases.is_partner_active import IsPartnerActiveUseCase
from src.domain.partner.dtos.is_partner_active_dtos import InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="is partner active")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="is_partner_active", poll_interval_millis=polling_interval * 1000)
def worker_task(partner_id: str) -> dict:
    logger.info("worker started")
    logger.debug(f"partner_id {partner_id}")

    input_dto = InputDto(
        id=partner_id,
    )

    repository = PartnerRepository()

    use_case = IsPartnerActiveUseCase(repository=repository, input_dto=input_dto)
    output_dto: OutputDto = use_case.execute()
    if not output_dto.active:
        logger.info("partner is not active")
        raise NonRetryableException("partner is not active")
    return output_dto.to_dict()
