from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.dtos.retrieve_partner_dtos import InputDto, OutputDto
from src.domain.partner.use_cases.retrieve_partner import RetrievePartnerUseCase
from src.services.logging import logger

from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository


logger = logger.bind(service="partner", context="controller", action="retrieve partner")


class RetrievePartnerController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self, id: UUID):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = PartnerRepository()
        self.input_dto = InputDto(id=id)

    def execute(self):
        """Execute the retrieve partner controller"""
        logger.debug("execute")
        try:
            use_case = RetrievePartnerUseCase(repository=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
