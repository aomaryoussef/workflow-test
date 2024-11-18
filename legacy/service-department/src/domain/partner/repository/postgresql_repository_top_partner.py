""" Module for Postgresql Top Partner Repository"""

from typing import Optional, List
from uuid import UUID
import structlog
from sqlalchemy import delete, select
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from src.services.postgresql import generate_db_session
from src.domain.partner.database.postgresql_models import TopPartnerDBModel
from src.domain.partner.models.top_partner import TopPartner
from src.domain.partner.models.partner import Partner
from src.domain.partner.repository.repository_top_partner_interface import (
    TopPartnerRepositoryInterface,
)
from src.utils.parse_postgres_error import parse_error_message


logger = structlog.get_logger()
logger = logger.bind(service="top_partner", context="repository", action="postgresql")


class TopPartnerRepository(TopPartnerRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def __db_to_entity(self, db_row: TopPartnerDBModel) -> TopPartner:
        topPartner = TopPartner(
            partner_id=db_row.partner_id,
        )
        topPartner.id = db_row.id
        topPartner.created_at = db_row.created_at
        topPartner.updated_at = db_row.updated_at
        topPartner.partner = Partner(
            name=db_row.partner.name,
            categories=db_row.partner.categories,
            status=db_row.partner.status,
            tax_registration_number=db_row.partner.tax_registration_number,
            commercial_registration_number=db_row.partner.commercial_registration_number,
        )
        topPartner.partner.id = db_row.partner.id
        topPartner.partner.created_at = db_row.partner.created_at
        topPartner.partner.updated_at = db_row.partner.updated_at
        return topPartner

    def get(self, id: UUID) -> Optional[TopPartner]:
        try:
            with self.__Session.begin() as session:
                statement = select(TopPartnerDBModel).where(TopPartnerDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_all(self) -> List[TopPartner]:
        try:
            with self.__Session.begin() as session:
                statement = select(TopPartnerDBModel)
                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
        else:
            return []

    def create(self, partner_id: UUID) -> Optional[TopPartner]:
        try:
            with self.__Session() as session:
                topPartner = TopPartner(
                    partner_id=partner_id,
                )

                top_partner_db_model = TopPartnerDBModel(
                    id=topPartner.id,
                    partner_id=topPartner.partner_id,
                    created_at=topPartner.created_at,
                    updated_at=topPartner.updated_at,
                )
                session.add(top_partner_db_model)
                session.commit()
                session.refresh(top_partner_db_model)
                if top_partner_db_model is not None:
                    return topPartner
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
                statement = delete(TopPartnerDBModel).where(TopPartnerDBModel.id == id)
                result = session.execute(statement)
                if result is not None:
                    return True
                return False
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True
