import structlog
from src.domain.lookups.repository.area_repository_interface import AreaRepositoryInterface
from src.domain.lookups.dtos.retrieve_all_areas_dtos import  OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="lookups", context="use case", action="retrieve all areas")


class RetrieveAllAreasUseCase:
    """This class is responsible for retrieve all areas."""

    def __init__(self, repository: AreaRepositoryInterface):
        self.repository = repository

    def execute(self) -> OutputDto:
        areas = self.repository.get_all()
        return OutputDto(areas=[area.to_dict() for area in areas])
