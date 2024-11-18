""" Module for PostgreSQL Governorate Repository """

from typing import List, Optional
import structlog
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src.domain.lookups.models.governorate import Governorate
from src.domain.lookups.repository.governorate_repository_interface import GovernorateRepositoryInterface
from src.services.postgresql import generate_db_session
from src.domain.lookups.database.postgresql_models import GovernorateDBModel

logger = structlog.get_logger().bind(service="governorate", context="repository", action="postgresql")


class GovernorateRepository(GovernorateRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def get(self, id: int) -> Optional[Governorate]:
        try:
            with self.__Session.begin() as session:
                statement = select(GovernorateDBModel).where(GovernorateDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result:
                    return Governorate(id=result.id, mc_id= result.mc_id, name_ar=result.name_ar, name_en=result.name_en)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_all(self) -> List[Governorate]:
        try:
            with self.__Session.begin() as session:
                statement = select(GovernorateDBModel)
                results = session.execute(statement).scalars().all()
                return [Governorate(id=result.id, name_ar=result.name_ar, name_en=result.name_en) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
