from conductor.client.worker.worker_task import worker_task
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository
from src.domain.partner.use_cases.create_partner_entity import CreatePartnerEntityUseCase
from src.domain.partner.dtos.create_partner_entity_dtos import InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner entity")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_entity", poll_interval_millis=polling_interval * 1000)
def create_partner_entity(
    name: str, categories: list[str], tax_registration_number: str, commercial_registration_number: str
) -> dict:
    logger.info("worker started")
    logger.debug(
        f"name {name}, categories {categories}, tax_registration_number {tax_registration_number}, "
        + f"commercial_registration_number {commercial_registration_number}"
    )
    input_dto = InputDto(
        name=name,
        categories=categories,
        tax_registration_number=tax_registration_number,
        commercial_registration_number=commercial_registration_number,
    )
    partner_repository = PartnerRepository()
    logger.info("partner repository created")
    use_case = CreatePartnerEntityUseCase(partner_repository=partner_repository, input_dto=input_dto)
    logger.info("use case created")
    output_dto: OutputDto = use_case.execute()
    logger.info("use case executed")
    return output_dto.to_dict()
