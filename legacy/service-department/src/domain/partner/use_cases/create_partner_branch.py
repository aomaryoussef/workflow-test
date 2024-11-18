import structlog

from src.domain.partner.dtos.create_partner_branch_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_partner_branch_validator import (
    CreatePartnerBranchInputDtoValidator,
)
from src.domain.partner.repository.repository_branch_interface import BranchRepositoryInterface
from src.utils.exceptions import ResourceNotCreatedException

from config.settings import settings

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create partner branch")

use_test_data = settings.get("app", default={}).get("use_test_data", default=False)


class CreatePartnerBranchUseCase:
    def __init__(
        self,
        branch_repository: BranchRepositoryInterface,
        input_dto: InputDto,
    ):
        self.branch_repository = branch_repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        validator = CreatePartnerBranchInputDtoValidator(self.input_dto.to_dict())
        validator.validate()

        branch = self.branch_repository.create(
            partner_id=self.input_dto.partner_id,
            name=self.input_dto.name,
            governorate_id=self.input_dto.governorate_id,
            city_id=self.input_dto.city_id,
            area_id=self.input_dto.area_id,
            area=self.input_dto.area,
            street=self.input_dto.street,
            location=self.input_dto.location,
            google_maps_link=self.input_dto.google_maps_link,
        )
        if branch is None:
            raise ResourceNotCreatedException("Unable to create a partner branch")

        output_dto = OutputDto(branch=branch)
        return output_dto
