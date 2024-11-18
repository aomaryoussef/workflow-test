import structlog
from src.domain.lookups.repository.governorate_repository_interface import GovernorateRepositoryInterface
from src.domain.lookups.dtos.retrieve_all_governorates_dtos import  OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="lookups", context="use case", action="retrieve all governorates")


class RetrieveAllGovernoratesCase:
    """This class is responsible for retrieve all governorates."""

    def __init__(self, repository: GovernorateRepositoryInterface):
        self.repository = repository

    def execute(self) -> OutputDto:
        governorates = self.repository.get_all()
        return OutputDto(governorates=[gov.to_dict() for gov in governorates])
