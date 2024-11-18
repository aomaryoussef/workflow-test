import structlog
from src.domain.lookups.repository.city_repository_interface import CityRepositoryInterface
from src.domain.lookups.dtos.retrieve_all_cities_dtos import  OutputDto

logger = structlog.get_logger()
logger = logger.bind(service="lookups", context="use case", action="retrieve all cities")


class RetrieveAllAreasUseCase:
    """This class is responsible for retrieve all cities."""

    def __init__(self, repository: CityRepositoryInterface):
        self.repository = repository

    def execute(self) -> OutputDto:
        cities = self.repository.get_all()
        return OutputDto(cities=[city.to_dict() for city in cities])
