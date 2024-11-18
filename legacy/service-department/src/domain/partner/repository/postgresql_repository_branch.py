""" Module for Postgresql Partner Repository"""

from typing import Optional, List
from uuid import UUID
import structlog
from src.domain.partner.models.branch import Branch, Coordinates
from src.domain.partner.repository.repository_branch_interface import BranchRepositoryInterface
from sqlalchemy import delete, select
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from src.services.postgresql import generate_db_session
from src.domain.partner.database.postgresql_models import BranchDBModel
from src.utils.parse_postgres_error import parse_error_message


logger = structlog.get_logger()
logger = logger.bind(service="partner_branch", context="repository", action="postgresql")


class BranchRepository(BranchRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def __db_to_entity(self, db_row: BranchDBModel) -> Branch:
        location = Coordinates(latitude=db_row.location_latitude, longitude=db_row.location_longitude)
        branch = Branch(
            id=db_row.id,
            partner_id=db_row.partner_id,
            name=db_row.name,
            governorate_id=db_row.governorate_id,
            city_id=db_row.city_id,
            area_id=db_row.area_id,
            area=db_row.area,
            street=db_row.street,
            location=location,
            google_maps_link=db_row.google_maps_link,
        )
        branch.id = db_row.id
        branch.created_at = db_row.created_at
        branch.updated_at = db_row.updated_at
        return branch

    def get(self, id: UUID) -> Optional[Branch]:
        try:
            with self.__Session.begin() as session:
                statement = select(BranchDBModel).where(BranchDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_all(self) -> List[Branch]:
        try:
            with self.__Session.begin() as session:
                statement = select(BranchDBModel)
                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
        else:
            return []

    def create(
        self,
        partner_id: UUID,
        name: str,
        governorate_id: int,
        city_id: int,
        street: str,
        location: Coordinates,
        google_maps_link: str,
        area_id: int = None,
        area: str = None,
    ) -> Optional[Branch]:
        try:
            with self.__Session() as session:
                branch = Branch(
                    partner_id=partner_id,
                    name=name,
                    governorate_id=governorate_id,
                    city_id=city_id,
                    area_id=area_id,
                    area=area,
                    street=street,
                    location=location,
                    google_maps_link=google_maps_link,
                )

                branch_db_model = BranchDBModel(
                    id=branch.id,
                    partner_id=branch.partner_id,
                    name=branch.name,
                    governorate_id=branch.governorate_id,
                    city_id=branch.city_id,
                    area_id=branch.area_id,
                    area=branch.area,
                    street=branch.street,
                    location_latitude=location.latitude,
                    location_longitude=location.longitude,
                    google_maps_link=branch.google_maps_link,
                    created_at=branch.created_at,
                    updated_at=branch.updated_at,
                )
                session.add(branch_db_model)
                session.commit()
                session.refresh(branch_db_model)
                if branch_db_model is not None:
                    return branch
                return None
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def delete(self, id: UUID) -> bool:
        try:
            with self.__Session.begin() as session:
                statement = delete(BranchDBModel).where(BranchDBModel.id == id)
                result = session.execute(statement)
                if result is not None:
                    return True
                return False
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True
