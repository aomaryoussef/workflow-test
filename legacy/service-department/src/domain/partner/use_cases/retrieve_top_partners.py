from src.services.logging import logger
from src.domain.partner.repository.repository_top_partner_interface import TopPartnerRepositoryInterface
from src.domain.partner.dtos.retrieve_top_partner_dto import RetrieveTopPartnersOutputDto

logger = logger.bind(service="partner", context="use case", action="retrieve top partners")


class RetrieveTopPartnersUseCase:
    """This class is responsible for retrieve top partners."""

    def __init__(
        self,
        repository: TopPartnerRepositoryInterface,
    ):
        self.repository = repository

    def execute(self) -> RetrieveTopPartnersOutputDto:
        logger.debug("execute")

        topPartners = self.repository.get_all()
        return RetrieveTopPartnersOutputDto(topPartners, len(topPartners))
