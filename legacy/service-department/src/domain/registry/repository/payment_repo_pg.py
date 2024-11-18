from types import FunctionType
from ulid import ULID
from typing import Optional
import structlog
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from src.domain.registry.repository.payment_repo_interface import PaymentRepoInterface
from src.domain.registry.models.payment import Payment, PaymentStatus
from src.services.postgresql import generate_db_session
from src.domain.registry.database.pg_models import PaymentDBModel


logger = structlog.get_logger()
logger = logger.bind(service="payment", context="repository", action="postgresql")


class PaymentRepo(PaymentRepoInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def __db_to_entity(self, db_row: PaymentDBModel) -> Payment:
        payment = Payment(
            id=ULID.from_str(db_row.id),
            status=db_row.status,
            channel=db_row.channel,
            channel_reference_id=db_row.channel_reference_id,
            channel_transaction_id=db_row.channel_transaction_id,
            payee_id=db_row.payee_id,
            payee_type=db_row.payee_type,
            payee_id_type=db_row.payee_id_type,
            billing_account=db_row.billing_account,
            billing_account_schedule_id=db_row.billing_account_schedule_id,
            amount_units=db_row.amount_units,
            amount_currency=db_row.amount_currency,
            raw_request=db_row.raw_request,
            booking_time=db_row.booking_time,
            created_at=db_row.created_at,
            updated_at=db_row.updated_at,
            created_by=db_row.created_by,
        )
        return payment

    def create(self, payment: Payment, callback: Optional[FunctionType]) -> Optional[Payment]:
        try:
            result = PaymentDBModel(
                id=str(payment.id),
                status=payment.status,
                channel=payment.channel,
                channel_reference_id=payment.channel_reference_id,
                channel_transaction_id=payment.channel_transaction_id,
                payee_id=payment.payee_id,
                payee_type=payment.payee_type,
                payee_id_type=payment.payee_id_type,
                billing_account=payment.billing_account,
                billing_account_schedule_id=payment.billing_account_schedule_id,
                raw_request=payment.raw_request,
                amount_units=payment.amount_units,
                amount_currency=payment.amount_currency,
                booking_time=payment.booking_time,
                created_by=payment.created_by,
            )
            with self.__Session.begin() as session:
                session.add(result)
                if callback is not None:
                    execute_callback = callback(payment)
                    if execute_callback is None:
                        logger.error("Callback returned None")
                        session.rollback()
                        result = None
                    else:
                        session.commit()
                else:
                    session.commit()
                if result is not None:
                    result = self.__db_to_entity(result)
        except SQLAlchemyError as error:
            logger.error(str(error))
            result = None
        return result

    def find(self, id: ULID) -> Optional[Payment]:
        try:
            with self.__Session() as session:
                result = session.get(PaymentDBModel, str(id))
                if result is not None:
                    return self.__db_to_entity(result)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        return None

    def find_all(
        self, billing_account: Optional[str] = None, billing_account_schedule_id: Optional[int] = None
    ) -> list[Payment]:
        try:
            with self.__Session() as session:
                statement = select(PaymentDBModel)
                if billing_account is not None:
                    statement = statement.where(PaymentDBModel.billing_account == billing_account)
                if billing_account_schedule_id is not None:
                    statement = statement.where(
                        PaymentDBModel.billing_account_schedule_id == billing_account_schedule_id
                    )
                results = session.execute(statement).scalars().all()
                return [self.__db_to_entity(result) for result in results]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
        return []

    def update(self, id: ULID, status: PaymentStatus) -> Optional[Payment]:
        try:
            with self.__Session() as session:
                result = session.get(PaymentDBModel, str(id))
                if result is not None:
                    result.status = status
                    session.commit()
                    session.refresh(result)
                    if result is not None:
                        return self.__db_to_entity(result)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        return None

    def delete(self, id: ULID) -> bool:
        try:
            with self.__Session() as session:
                result = session.get(PaymentDBModel, str(id))
                if result is not None:
                    session.delete(result)
                    session.commit()
                else:
                    return False
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True
