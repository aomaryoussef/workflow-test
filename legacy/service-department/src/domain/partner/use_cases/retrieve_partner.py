import structlog
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.domain.partner.dtos.retrieve_partner_dtos import InputDto, OutputDto
from src.utils.exceptions import NotFoundException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="retrieve partner")


class RetrievePartnerUseCase:
    """This class is responsible for retrieve specific partner."""

    def __init__(self, repository: PartnerRepositoryInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")

        partner = self.repository.find_one(id=self.input_dto.id)
        if partner is None:
            raise NotFoundException("partner not found")
        output_dto = OutputDto(partner=partner)
        return output_dto
