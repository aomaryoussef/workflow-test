""" Module for PostgreSQL Area Repository """

from typing import List, Optional
import structlog
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src.domain.lookups.models.area import Area
from src.domain.lookups.repository.area_repository_interface import AreaRepositoryInterface
from src.services.postgresql import generate_db_session
from src.domain.lookups.database.postgresql_models import AreaDBModel

logger = structlog.get_logger().bind(service="area", context="repository", action="postgresql")


class AreaRepository(AreaRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def get(self, id: int) -> Optional[Area]:
        try:
            with self.__Session.begin() as session:
                statement = select(AreaDBModel).where(AreaDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result:
                    return Area(id=result.id, name_ar=result.name_ar, name_en=result.name_en, city_id=result.city_id, governorate_id=result.governorate_id)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_all(self) -> List[Area]:
        try:
            with self.__Session.begin() as session:
                statement = select(AreaDBModel)
                results = session.execute(statement).scalars().all()
                return [Area(id=result.id, name_ar=result.name_ar, name_en=result.name_en, city_id=result.city_id, governorate_id=result.governate_id) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
