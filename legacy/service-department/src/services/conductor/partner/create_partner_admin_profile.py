from conductor.client.worker.worker_task import worker_task
from src.domain.partner.repository.postgresql_repository_user_profile import UserProfileRepository
from src.domain.partner.use_cases.create_partner_admin_user_profile import CreatePartnerAdminUserProfileUseCase
from src.domain.partner.dtos.create_partner_admin_user_profile_dtos import InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner bank account")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_admin_profile", poll_interval_millis=polling_interval * 1000)
def create_partner_admin_profile(
    iam_id: str,
    partner_id: str,
    first_name: str,
    last_name: str,
    email: str,
    phone_number: str,
) -> dict:
    logger.info("worker started")
    logger.debug(
        f"iam_id {iam_id}, partner_id {partner_id}, first_name {first_name}, last_name {last_name}, email {email}, phone_number {phone_number}"
    )

    input_dto = InputDto(
        iam_id=iam_id,
        partner_id=partner_id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone_number=phone_number,
    )

    repository = UserProfileRepository()

    use_case = CreatePartnerAdminUserProfileUseCase(repository=repository, input_dto=input_dto)
    logger.info("use case created")
    output_dto: OutputDto = use_case.execute()
    logger.info("use case executed")
    return output_dto.to_dict()
