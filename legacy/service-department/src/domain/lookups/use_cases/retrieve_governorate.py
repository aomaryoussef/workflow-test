from uuid import UUID
import structlog
from src.domain.lookups.repository.governorate_repository_interface import GovernorateRepositoryInterface
from src.domain.lookups.dtos.retrieve_governorate_dtos import  OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="lookups", context="use case", action="retrieve governorate")


class RetrieveGovernorateCase:
    """This class is responsible for retrieve governorate by id."""

    def __init__(self,id: int ,repository: GovernorateRepositoryInterface):
        self.repository = repository
        self.id = id

    def execute(self) -> OutputDto:
        governorates = self.repository.get(id=self.id)
        return OutputDto(governorates=governorates)
