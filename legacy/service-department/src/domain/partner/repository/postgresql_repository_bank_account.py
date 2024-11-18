""" Module for Postgresql Bank Account Repository"""

from typing import Optional, List
from uuid import UUID
import structlog
from src.domain.partner.models.bank_account import BankAccount, BankName
from src.domain.partner.repository.repository_bank_account_interface import BankAccountRepositoryInterface
from sqlalchemy import delete, select
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from src.services.postgresql import generate_db_session
from src.domain.partner.database.postgresql_models import BankAccountDBModel
from src.utils.parse_postgres_error import parse_error_message


logger = structlog.get_logger()
logger = logger.bind(service="partner_bank_account", context="repository", action="postgresql")


class BankAccountRepository(BankAccountRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def __db_to_entity(self, db_row: BankAccountDBModel) -> BankAccount:
        bank_account = BankAccount(
            partner_id=db_row.partner_id,
            bank_name=db_row.bank_name,
            branch_name=db_row.branch_name,
            beneficiary_name=db_row.beneficiary_name,
            iban=db_row.iban,
            swift_code=db_row.swift_code,
            account_number=db_row.account_number,
        )
        bank_account.id = db_row.id
        bank_account.created_at = db_row.created_at
        bank_account.updated_at = db_row.updated_at
        return bank_account

    def get(self, id: UUID) -> Optional[BankAccount]:
        try:
            with self.__Session.begin() as session:
                statement = select(BankAccountDBModel).where(BankAccountDBModel.id == id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                else:
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

    def get_by_partner_id(self, partner_id: UUID) -> Optional[BankAccount]:
        try:
            with self.__Session.begin() as session:
                statement = select(BankAccountDBModel).where(BankAccountDBModel.partner_id == partner_id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self.__db_to_entity(result)
                else:
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

    def get_all(self) -> List[BankAccount]:
        try:
            with self.__Session.begin() as session:
                statement = select(BankAccountDBModel)
                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
        else:
            return []

    def create(
        self,
        partner_id: UUID,
        bank_name: BankName,
        branch_name: str,
        beneficiary_name: str,
        iban: str,
        swift_code: str,
        account_number: str,
    ) -> Optional[BankAccount]:
        try:
            with self.__Session() as session:
                bank_account = BankAccount(
                    partner_id=partner_id,
                    bank_name=bank_name,
                    branch_name=branch_name,
                    beneficiary_name=beneficiary_name,
                    iban=iban,
                    swift_code=swift_code,
                    account_number=account_number,
                )

                bank_account_db_model = BankAccountDBModel(
                    id=bank_account.id,
                    partner_id=bank_account.partner_id,
                    bank_name=bank_account.bank_name,
                    branch_name=bank_account.branch_name,
                    beneficiary_name=bank_account.beneficiary_name,
                    iban=bank_account.iban,
                    swift_code=bank_account.swift_code,
                    account_number=bank_account.account_number,
                    created_at=bank_account.created_at,
                    updated_at=bank_account.updated_at,
                )
                session.add(bank_account_db_model)
                session.commit()
                session.refresh(bank_account_db_model)
                if bank_account_db_model is not None:
                    return bank_account
                else:
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
                statement = delete(BankAccountDBModel).where(BankAccountDBModel.id == id)
                result = session.execute(statement)
                if result is not None:
                    return True
                return False
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True
