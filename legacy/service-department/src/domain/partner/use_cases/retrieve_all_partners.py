import structlog
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.domain.partner.dtos.retrieve_all_partners_dtos import OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="retrieve all partners")


class RetrieveAllPartnersUseCase:
    """This class is responsible for retrieve all partners."""

    def __init__(
        self,
        repository: PartnerRepositoryInterface,
    ):
        self.repository = repository

    def execute(self) -> OutputDto:
        logger.debug("execute")
        partners = self.repository.find_all()
        output_dto = OutputDto(partners=partners)
        return output_dto
