""" Module for PostgreSQL City Repository """

from typing import List, Optional
import structlog
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src.domain.lookups.models.city import City
from src.domain.lookups.repository.city_repository_interface import CityRepositoryInterface
from src.services.postgresql import generate_db_session
from src.domain.lookups.database.postgresql_models import CityDBModel

logger = structlog.get_logger().bind(service="city", context="repository", action="postgresql")


class CityRepository(CityRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def get(self, id: int) -> Optional[City]:
        try:
            with self.__Session.begin() as session:
                statement = select(CityDBModel).where(CityDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result:
                    return City(id=result.id, name_ar=result.name_ar, name_en=result.name_en, governorate_id=result.governorate_id)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_all(self) -> List[City]:
        try:
            with self.__Session.begin() as session:
                statement = select(CityDBModel)
                results = session.execute(statement).scalars().all()
                return [City(id=result.id, name_ar=result.name_ar, name_en=result.name_en, governorate_id=result.governorate_id) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
