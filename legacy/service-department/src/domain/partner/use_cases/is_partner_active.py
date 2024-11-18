import structlog
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.domain.partner.models.partner import PartnerStatus
from src.domain.partner.dtos.is_partner_active_dtos import InputDto, OutputDto
from src.utils.exceptions import NotFoundException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="is partner active")


class IsPartnerActiveUseCase:
    def __init__(self, repository: PartnerRepositoryInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")

        partner = self.repository.find_one(id=self.input_dto.id)
        if partner is None:
            raise NotFoundException("partner not found")
        output_dto = OutputDto(active=partner.status == PartnerStatus.ACTIVE)
        return output_dto
