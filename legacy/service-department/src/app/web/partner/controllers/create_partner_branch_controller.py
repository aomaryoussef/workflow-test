from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.dtos.create_partner_branch_dtos import InputDto, OutputDto, Coordinates
from src.domain.partner.use_cases.create_partner_branch import CreatePartnerBranchUseCase
from src.services.logging import logger
from src.domain.partner.repository.postgresql_repository_branch import BranchRepository

logger = logger.bind(service="partner", context="controller", action="create partner branch")


class CreatePartnerBranchController(BaseController):
    def __init__(self, partner_id: UUID, json_input):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = BranchRepository()
        self.input_dto: InputDto = InputDto(
            partner_id=partner_id,
            name=json_input["name"],
            governorate_id=json_input.get("governorate_id"),
            city_id=json_input.get("city_id"),
            area_id=json_input.get("area_id"),
            area=json_input.get("area"),
            street=json_input["street"],
            location=Coordinates(
                latitude=json_input["location"]["latitude"],
                longitude=json_input["location"]["longitude"],
            ),
            google_maps_link=json_input["google_maps_link"],
        )

    def execute(self):
        logger.debug("execute")
        try:
            use_case = CreatePartnerBranchUseCase(
                branch_repository=self.repository,
                input_dto=self.input_dto,
            )
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show_created(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
