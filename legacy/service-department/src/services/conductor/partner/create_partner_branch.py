from conductor.client.worker.worker_task import worker_task
from src.domain.partner.repository.postgresql_repository_branch import BranchRepository
from src.domain.partner.use_cases.create_partner_branch import CreatePartnerBranchUseCase
from src.domain.partner.models.branch import  Coordinates
from src.domain.partner.dtos.create_partner_branch_dtos import InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner branch")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_branch", poll_interval_millis=polling_interval * 1000)
def create_partner_branch(
    partner_id: str,
    governorate_id: int,
    city_id: int,
    area_id: int,
    area: str,
    street: str,
    location_latitude: str,
    location_longitude: str,
    google_maps_link: str,
) -> dict:
    logger.info("worker started")
    logger.debug(
        f"partner_id {partner_id}, governorate {governorate_id}, city {city_id}, "
        + f"area {area}, street {street}, location_latitude {location_latitude}, "
        + f"location_longitude {location_longitude}"
    )
    branch_location = Coordinates(
        latitude=location_latitude,
        longitude=location_longitude,
    )
    input_dto = InputDto(
        partner_id=partner_id,
        governorate_id=governorate_id,
        city_id=city_id,
        area_id=area_id,
        area=area,
        street=street,
        location=branch_location,
        google_maps_link=google_maps_link,
    )
    repository = BranchRepository()

    use_case = CreatePartnerBranchUseCase(branch_repository=repository, input_dto=input_dto)
    logger.info("use case created")
    output_dto: OutputDto = use_case.execute()
    logger.info("use case executed")
    return output_dto.to_dict()
