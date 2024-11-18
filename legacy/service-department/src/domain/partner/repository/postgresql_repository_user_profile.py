""" Module for Postgresql UserProfile Repository"""

from typing import Optional
import structlog
from sqlalchemy import delete, select, func

from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from src.services.postgresql import generate_db_session

from src.domain.partner.database.postgresql_models import BranchDBModel, UserProfileDBModel
from src.domain.partner.models.cashier_profile import CashierProfile
from src.domain.partner.models.user_profile import UserProfile
from src.domain.partner.repository.repository_user_profile_interface import (
    UserProfileRepositoryInterface,
)
from src.domain.partner.models.user_profile import ProfileType
from uuid import UUID

logger = structlog.get_logger()
logger = logger.bind(service="partner_user_profile", context="repository", action="postgresql")


class UserProfileRepository(UserProfileRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def __db_to_cashier_entity(self, db_row: UserProfileDBModel) -> Optional[CashierProfile]:
        user_profile = CashierProfile(
            iam_id=db_row.iam_id,
            partner_id=db_row.partner_id,
            cashier_id=db_row.id,
            partner_name=db_row.partner.name,
            branch_id=db_row.branch_id,
        )
        user_profile.id = db_row.id
        user_profile.created_at = db_row.created_at
        user_profile.updated_at = db_row.updated_at
        return user_profile

    def __db_to_entity(self, db_row: UserProfileDBModel) -> Optional[UserProfile]:
        user_profile = UserProfile(
            iam_id=db_row.iam_id,
            partner_id=db_row.partner_id,
            first_name=db_row.first_name,
            last_name=db_row.last_name,
            phone_number=db_row.phone_number,
            email=db_row.email,
            national_id=db_row.national_id,
            profile_type=db_row.profile_type,
            branch_id=db_row.branch_id,
        )
        user_profile.id = db_row.id
        user_profile.created_at = db_row.created_at
        user_profile.updated_at = db_row.updated_at
        return user_profile

    def get(self, id: UUID) -> Optional[UserProfile]:
        try:
            with self.__Session.begin() as session:
                statement = select(UserProfileDBModel).where(UserProfileDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_all(self, partner_id, type, page=None, per_page=None) -> list[UserProfile]:
        try:
            with self.__Session.begin() as session:
                statement = None
                if page is not None and per_page is not None:
                    statement = (
                        select(UserProfileDBModel)
                        .where(UserProfileDBModel.partner_id == partner_id)
                        .where(UserProfileDBModel.profile_type == type)
                        .limit(per_page)
                        .offset((page - 1) * per_page)
                    )
                else:
                    statement = (
                        select(UserProfileDBModel)
                        .where(UserProfileDBModel.partner_id == partner_id)
                        .where(UserProfileDBModel.profile_type == type)
                    )

                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]

        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
        else:
            return []

    def get_by_email(self, email: str) -> Optional[UserProfile]:
        try:
            with self.__Session.begin() as session:
                statement = select(UserProfileDBModel).where(UserProfileDBModel.email.__eq__(email))
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_by_phone_number(self, phone_number: str) -> Optional[UserProfile]:
        try:
            with self.__Session.begin() as session:
                statement = select(UserProfileDBModel).where(UserProfileDBModel.phone_number.__eq__(phone_number))
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_cashier_by_iam(self, iam_id: str) -> Optional[CashierProfile]:
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(UserProfileDBModel)
                    .join(UserProfileDBModel.partner)
                    .where(UserProfileDBModel.iam_id.__eq__(iam_id))
                )
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_cashier_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_branch_id(self, partner_id: str) -> Optional[str]:
        try:
            with self.__Session.begin() as session:
                statement = select(BranchDBModel).where(BranchDBModel.partner_id.__eq__(partner_id))
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return result.id
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_by_iam_id(self, iam_id: str) -> Optional[UserProfile]:
        try:
            with self.__Session.begin() as session:
                statement = select(UserProfileDBModel).where(UserProfileDBModel.iam_id.__eq__(iam_id))
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_count(self, partner_id, type) -> int:
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(func.count())
                    .where(UserProfileDBModel.partner_id == partner_id)
                    .where(UserProfileDBModel.profile_type == type)
                )
                result = session.execute(statement).scalar()
                if result is not None:
                    return result
                return 0
        except SQLAlchemyError as error:
            logger.error(str(error))
            return 0
        else:
            return 0

    def create(
        self,
        iam_id: UUID,
        partner_id: UUID,
        first_name: str,
        last_name: str,
        phone_number: str,
        email: str,
        national_id: str,
        profile_type: ProfileType,
        branch_id: Optional[UUID] = None,
    ) -> Optional[UserProfile]:
        try:
            with self.__Session() as session:
                user_profile = UserProfile(
                    iam_id=iam_id,
                    partner_id=partner_id,
                    first_name=first_name,
                    last_name=last_name,
                    phone_number=phone_number,
                    email=email,
                    national_id=national_id,
                    profile_type=profile_type,
                    branch_id=branch_id,
                )
                user_profile_db_model = UserProfileDBModel(
                    id=user_profile.id,
                    iam_id=user_profile.iam_id,
                    partner_id=user_profile.partner_id,
                    first_name=user_profile.first_name,
                    last_name=user_profile.last_name,
                    phone_number=user_profile.phone_number,
                    email=user_profile.email,
                    national_id=user_profile.national_id,
                    profile_type=user_profile.profile_type,
                    branch_id=user_profile.branch_id,
                    created_at=user_profile.created_at,
                    updated_at=user_profile.updated_at,
                )
                session.add(user_profile_db_model)
                session.commit()
                session.refresh(user_profile_db_model)
                if user_profile_db_model is not None:
                    return user_profile
                return None
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            raise ValueError(error_message)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def delete(self, id: UUID) -> bool:
        try:
            with self.__Session.begin() as session:
                statement = delete(UserProfileDBModel).where(UserProfileDBModel.id == id)
                result = session.execute(statement)
                if result is not None:
                    return True
                return False
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True
