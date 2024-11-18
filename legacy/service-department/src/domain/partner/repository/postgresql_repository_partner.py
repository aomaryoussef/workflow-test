""" Module for Postgresql Partner Repository"""

import structlog
from types import FunctionType
from typing import Optional, List
from uuid import UUID
from sqlalchemy import delete, select, literal_column
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from src.services.postgresql import generate_db_session
from src.domain.partner.database.postgresql_models import (
    BranchDBModel,
    PartnerDBModel,
    BankAccountDBModel,
    UserProfileDBModel,
)
from src.domain.partner.models.branch import Branch, Coordinates
from src.domain.partner.models.partner import Partner
from src.domain.partner.models.bank_account import BankAccount
from src.domain.partner.models.user_profile import UserProfile
from src.domain.partner.repository.repository_partner_interface import (
    PartnerRepositoryInterface,
)
from src.utils.parse_postgres_error import parse_error_message

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="repository", action="postgresql")


class PartnerRepository(PartnerRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def _branch_db_to_entity(self, db_row: BranchDBModel) -> Branch:
        return Branch(
            id=db_row.id,
            name=db_row.name,
            partner_id=db_row.partner_id,
            governorate_id=db_row.governorate_id,
            city_id=db_row.city_id,
            area_id=db_row.area_id,
            area=db_row.area,
            street=db_row.street,
            location=Coordinates(db_row.location_latitude, db_row.location_longitude),
            google_maps_link=db_row.google_maps_link,
        )

    def _bank_account_db_to_entity(self, db_row: BankAccountDBModel) -> BankAccount:
        return BankAccount(
            id=db_row.id,
            partner_id=db_row.partner_id,
            bank_name=db_row.bank_name,
            branch_name=db_row.branch_name,
            beneficiary_name=db_row.beneficiary_name,
            iban=db_row.iban,
            swift_code=db_row.swift_code,
            account_number=db_row.account_number,
        )

    def _user_profile_db_to_entity(self, db_row: UserProfileDBModel) -> UserProfile:
        return UserProfile(
            id=db_row.id,
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

    def __db_to_entity(self, db_row: PartnerDBModel) -> Partner:
        branches = [self._branch_db_to_entity(branch) for branch in db_row.branches]
        bank_accounts = [self._bank_account_db_to_entity(bank_account) for bank_account in db_row.bank_accounts]

        partner = Partner(
            name=db_row.name,
            categories=db_row.categories,
            status=db_row.status,
            tax_registration_number=db_row.tax_registration_number,
            commercial_registration_number=db_row.commercial_registration_number,
            branches=branches,
            bank_accounts=bank_accounts,
        )
        partner.id = db_row.id
        partner.created_at = db_row.created_at
        partner.updated_at = db_row.updated_at
        return partner

    def find_by(self, column_name, column_value) -> Optional[Partner]:
        try:
            with self.__Session.begin() as session:
                statement = select(PartnerDBModel)
                statement = statement.where(literal_column(column_name) == column_value)
                result = session.execute(statement).scalar()
                return self.__db_to_entity(result) if result is not None else None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_one(self, id: Optional[UUID] = None, name: Optional[str] = None) -> Optional[Partner]:
        try:
            with self.__Session.begin() as session:
                statement = select(PartnerDBModel)
                statement = statement.where(PartnerDBModel.id == id) if id is not None else statement
                statement = statement.where(PartnerDBModel.name == name) if name is not None else statement
                result = session.execute(statement).scalar()
                return self.__db_to_entity(result) if result is not None else None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_all(self) -> List[Partner]:
        try:
            with self.__Session.begin() as session:
                statement = select(PartnerDBModel).order_by(PartnerDBModel.created_at.desc())
                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []

    def get_names_by_ids(self, ids: List[UUID]) -> List[str]:
        try:
            with self.__Session.begin() as session:
                statement = select(PartnerDBModel.name, PartnerDBModel.id).where(PartnerDBModel.id.in_(ids))
                results = session.execute(statement).all()
                return results
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []

    def create(
        self, name: str, categories: list[str], tax_registration_number: str, commercial_registration_number: str
    ) -> Optional[Partner]:
        partner = Partner(
            name=name,
            categories=categories,
            tax_registration_number=tax_registration_number,
            commercial_registration_number=commercial_registration_number,
        )

        partner_db_model = PartnerDBModel(
            id=partner.id,
            name=partner.name,
            categories=partner.categories,
            status=partner.status,
            tax_registration_number=partner.tax_registration_number,
            commercial_registration_number=partner.commercial_registration_number,
            created_at=partner.created_at,
            updated_at=partner.updated_at,
        )

        try:
            with self.__Session() as session:
                session.add(partner_db_model)
                session.commit()
                session.refresh(partner_db_model)
                if partner_db_model is not None:
                    return partner
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise Exception(f"error: {error_type} for field {field_name}")
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        return None

    def create_complete_partner(self, partner: Partner, callback: Optional[FunctionType] = None) -> Optional[Partner]:
        """Create a Partner

        :return: Partner
        """
        try:
            partner_db_model = PartnerDBModel(
                id=partner.id,
                name=partner.name,
                categories=partner.categories,
                status=partner.status,
                tax_registration_number=partner.tax_registration_number,
                commercial_registration_number=partner.commercial_registration_number,
                created_at=partner.created_at,
                updated_at=partner.updated_at,
            )
            bank_account_db_model = BankAccountDBModel(
                partner_id=partner.bank_accounts[0].partner_id,
                bank_name=partner.bank_accounts[0].bank_name,
                branch_name=partner.bank_accounts[0].branch_name,
                beneficiary_name=partner.bank_accounts[0].beneficiary_name,
                iban=partner.bank_accounts[0].iban,
                swift_code=partner.bank_accounts[0].swift_code,
                account_number=partner.bank_accounts[0].account_number,
            )
            partner_db_model.branches = []
            partner_db_model.bank_accounts = [bank_account_db_model]

            result = None

            with self.__Session.begin() as session:
                session.add(partner_db_model)
                session.add(bank_account_db_model)
                if callback is not None:
                    execute_callback = callback(partner)
                    if execute_callback is None:
                        logger.error("Callback returned None")
                        session.rollback()
                        result = None
                    else:
                        session.commit()
                else:
                    session.commit()
                if partner_db_model is not None:
                    result = self.__db_to_entity(partner_db_model)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise Exception(f"error: {error_type} for field {field_name}")
        except SQLAlchemyError as error:
            logger.error(str(error))
            result = None
        return result

    def delete(self, id: UUID) -> bool:
        try:
            with self.__Session.begin() as session:
                statement = delete(PartnerDBModel).where(PartnerDBModel.id == id)
                result = session.execute(statement)
                if result is not None:
                    return True
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        return False
