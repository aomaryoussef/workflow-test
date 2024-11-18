from datetime import datetime
import uuid
from src.services.postgresql import generate_db_session
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from sqlalchemy import desc, select
from typing import Optional
from uuid import UUID
import structlog
from src.utils.parse_postgres_error import parse_error_message
from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)
from src.domain.consumer.models.consumer import Consumer, ConsumerStatus
from src.domain.consumer.models.credit_limit import CreditLimit, CreditLimitDirection
from src.domain.consumer.database.postgresql_models import (
    BetaConsumerDBModel,
    ConsumerDBModel,
    NewConsumerCreditLimitDBModel,
    UsedConsumerCreditLimitDBModel,
)

logger = structlog.get_logger()
logger = logger.bind(service="consumer", context="repository", action="postgresql")


class ConsumerPostgresqlRepository(ConsumerRepositoryInterface):
    def __init__(self) -> None:
        self.__Session = generate_db_session()

    def delete(self, consumer: Consumer):
        try:
            with self.__Session.begin() as session:
                credit_limit = session.query(NewConsumerCreditLimitDBModel).filter_by(consumer_id=consumer.id).first()
                if credit_limit:
                    session.delete(credit_limit)
                used_credit_limit = session.query(UsedConsumerCreditLimitDBModel).filter_by(consumer_id=consumer.id).first()
                if used_credit_limit:
                    session.delete(used_credit_limit)
                consumer_model = session.query(ConsumerDBModel).filter_by(id=consumer.id).first()
                session.delete(consumer_model)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return False
        else:
            return True

    def get_by_phone_number(self, phone_number: str) -> Optional[Consumer]:
        try:
            with self.__Session.begin() as session:
                db_consumer = session.query(ConsumerDBModel).filter_by(phone_number=phone_number).first()
                if db_consumer is None:
                    return None
                db_credit_limit = (
                    session.query(NewConsumerCreditLimitDBModel)
                    .filter_by(consumer_id=db_consumer.id)
                    .order_by(desc(NewConsumerCreditLimitDBModel.active_since))
                    .limit(1)
                    .first()
                )
                return self._to_consumer_model(db_consumer, db_credit_limit)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def create_consumer_credit_limit(self, consumer_id, credit_limit) -> Optional[CreditLimit]:
        try:
            with self.__Session.begin() as session:
                db_credit_limit = NewConsumerCreditLimitDBModel(
                    consumer_id=consumer_id,
                    max_credit_limit=credit_limit,
                    available_credit_limit=credit_limit,
                    active_since=datetime.now()

                )
                session.add(db_credit_limit)
                db_used_credit_limit = UsedConsumerCreditLimitDBModel(
                    consumer_id=consumer_id,
                    used_credit=-credit_limit
                )
                session.add(db_used_credit_limit)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def activate_consumer(self, consumer_id, credit_officer_iam_id, branch_name) -> Optional[Consumer]:
        try:
            with self.__Session.begin() as session:
                db_consumer = session.query(ConsumerDBModel).filter_by(id=consumer_id).first()
                db_credit_limit = (
                    session.query(NewConsumerCreditLimitDBModel)
                    .filter_by(consumer_id=consumer_id)
                    .order_by(desc(NewConsumerCreditLimitDBModel.active_since))
                    .limit(1)
                    .first()
                )
                db_consumer.credit_limit.append(db_credit_limit)
                db_consumer.status = ConsumerStatus.ACTIVE
                db_consumer.activated_at = datetime.now()
                db_consumer.activated_by_iam_id = credit_officer_iam_id
                db_consumer.activation_branch = branch_name
                db_consumer.classification = "A"
                session.add(db_consumer)
                return self._to_consumer_model(db_consumer, db_credit_limit)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def update_status(self, consumer_id, status) -> Optional[Consumer]:
        try:
            with self.__Session.begin() as session:
                db_consumer = session.query(ConsumerDBModel).filter_by(id=consumer_id).first()
                db_consumer.status = status
                db_consumer.classification = "A"
                session.add(db_consumer)
                return self._to_consumer_model(db_consumer, None)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_by_iam_id(self, iam_id: str) -> Optional[Consumer]:
        try:
            with self.__Session.begin() as session:
                db_consumer = session.query(ConsumerDBModel).filter_by(iam_id=iam_id).first()
                if db_consumer is not None:
                    return self._to_consumer_model(db_consumer, None)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def create_consumer(self, consumer: Consumer) -> Optional[Consumer]:
        try:
            with self.__Session() as session:
                db_consumer = ConsumerDBModel(
                    id=consumer.id,
                    phone_number=consumer.phone_number,
                    iam_id=consumer.iam_id,
                    national_id=consumer.national_id,
                    classification=consumer.classification,
                    status=consumer.status,
                )
                db_consumer.classification = "A"

                db_credit_limit = None
                session.add(db_consumer)
                session.commit()

                # temporary until getting the credit limit and this condition will removed
                if consumer.credit_limit is not None:
                    session.flush()
                    db_credit_limit = NewConsumerCreditLimitDBModel(
                        consumer_id=db_consumer.id,
                        max_credit_limit=consumer.credit_limit.value,
                        available_credit_limit=consumer.credit_limit.value,
                        active_since=datetime.now()
                    )
                    session.add(db_credit_limit)
                    session.commit()
    
                    db_used_credit_limit = UsedConsumerCreditLimitDBModel(
                        consumer_id=db_consumer.id,
                        used_credit=-consumer.credit_limit.value
                    )
                    session.add(db_used_credit_limit)
                    
                session.refresh(db_consumer)
                # temporary until getting the credit limit and this condition will removed
                if consumer.credit_limit is not None:
                    session.refresh(db_credit_limit)
                    session.refresh(db_used_credit_limit)

                if db_consumer is not None:
                    return self._to_consumer_model(db_consumer, db_credit_limit)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get(self, consumer_id: UUID) -> Optional[Consumer]:
        try:
            with self.__Session.begin() as session:
                statement = select(ConsumerDBModel).where(ConsumerDBModel.id == consumer_id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    return self._to_consumer_model(result, None)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def get_available_credit_limit(self, consumer_id: UUID) -> Optional[CreditLimit]:
        try:
            with self.__Session.begin() as session:
                db_credit_limit = (
                    session.query(NewConsumerCreditLimitDBModel)
                    .filter_by(consumer_id=consumer_id)
                    .order_by(desc(NewConsumerCreditLimitDBModel.active_since))
                    .limit(1)
                    .first()
                )
                if db_credit_limit:
                    return CreditLimit(
                        id=db_credit_limit.id,
                        consumer_id=consumer_id,
                        value=db_credit_limit.available_credit_limit,
                        created_at=db_credit_limit.created_at,
                    )
                return None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def update_credit_limit(self, consumer_id: UUID, amount: int, direction: CreditLimitDirection) -> Optional[NewConsumerCreditLimitDBModel]:
        try:
            with self.__Session.begin() as session:
                # Get the latest available credit limit
                db_credit_limit = (
                    session.query(NewConsumerCreditLimitDBModel)
                    .filter_by(consumer_id=consumer_id)
                    .order_by(desc(NewConsumerCreditLimitDBModel.created_at))
                    .limit(1)
                    .first()
                )

                if not db_credit_limit:
                    raise ValueError("No credit limit found for consumer")

                # Calculate new available credit limit based on direction
                if direction == CreditLimitDirection.INCREASE:
                    new_available_credit = db_credit_limit.available_credit_limit + amount
                    used_credit_amount = -amount  # Negative for increasing the credit limit
                elif direction == CreditLimitDirection.DECREASE:
                    new_available_credit = db_credit_limit.available_credit_limit - amount
                    used_credit_amount = amount  # Positive for decreasing the credit limit
                    if new_available_credit < 0:
                        raise ValueError("Insufficient available credit limit")
                else:
                    raise ValueError("Invalid credit limit direction")

                # Create a new record for the updated credit limit
                new_credit_limit = NewConsumerCreditLimitDBModel(
                    id=uuid.uuid4(),
                    consumer_id=consumer_id,
                    max_credit_limit=db_credit_limit.max_credit_limit,
                    available_credit_limit=new_available_credit,
                    active_since=datetime.now(),
                )
                session.add(new_credit_limit)

                # Create a new record for the used credit limit with the correct sign
                used_credit_limit = UsedConsumerCreditLimitDBModel(
                    id=uuid.uuid4(),
                    consumer_id=consumer_id,
                    used_credit=used_credit_amount,  # Negative for increase, positive for decrease
                )
                session.add(used_credit_limit)

                return new_credit_limit

        except (SQLAlchemyError, ValueError) as error:
            logger.error(str(error))
            return None

    def phone_number_exists_in_beta(self, phone_number: str) -> bool:
        """
        Check if the given phone number exists in the BetaConsumerDBModel.
        """
        try:
            with self.__Session.begin() as session:
                # Query the BetaConsumerDBModel for the phone number
                exists = session.query(BetaConsumerDBModel).filter_by(phone_number=phone_number).first()
                return exists is not None  # Return True if a record exists, otherwise False
        except SQLAlchemyError as error:
            logger.error(f"Error checking phone number {phone_number} in BetaConsumerDBModel: {str(error)}")
            return False


    def save_consumer(self, consumer: Consumer) -> Optional[Consumer]:
        try:
            with self.__Session() as session:
                statement = select(ConsumerDBModel).where(ConsumerDBModel.id == consumer.id)
                result = session.execute(statement).scalar_one_or_none()
                if result is not None:
                    db_consumer = ConsumerDBModel(
                        id=consumer.id,
                        full_name=consumer.full_name,
                        national_id=consumer.national_id,
                        job_name=consumer.job_name,
                        guarantor_job=consumer.guarantor_job,
                        address=consumer.address,
                        address_description=consumer.address_description,
                        additional_salary=consumer.additional_salary,
                        salary=consumer.salary,
                        car_year=consumer.car_year,
                        city=consumer.city,
                        club=consumer.club,
                        district=consumer.district,
                        company=consumer.company,
                        governorate=consumer.governorate,
                        guarantor_relationship=consumer.guarantor_relationship,
                        house_type=consumer.house_type,
                        marital_status=consumer.marital_status,
                        work_type=consumer.work_type,
                        status=result.status,
                        activated_at=result.activated_at,
                        activated_by_iam_id=result.activated_by_iam_id,
                        activation_branch=result.activation_branch,
                        phone_number=result.phone_number,
                        iam_id=result.iam_id,
                        single_payment_day=consumer.single_payment_day,
                        classification=consumer.classification,
                        company_address=consumer.company_address,
                        work_phone_number=consumer.work_phone_number,
                        home_phone_number=consumer.home_phone_number,
                        additional_salary_source=consumer.additional_salary_source,
                        national_id_address=consumer.national_id_address,
                    )
                    db_consumer.classification = "A"
                    db_consumer = session.merge(db_consumer)
                    session.add(db_consumer)
                    session.commit()
                    session.refresh(db_consumer)
                    if db_consumer is not None:
                        return self._to_consumer_model(db_consumer, None)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None
        else:
            return None

    def _to_consumer_model(self, db_consumer: ConsumerDBModel, db_credit_limit: Optional[ConsumerDBModel]):
        consumer = Consumer(
            id=db_consumer.id,
            phone_number=db_consumer.phone_number,
            iam_id=db_consumer.iam_id,
            status=db_consumer.status,
            first_name=db_consumer.first_name,
            last_name=db_consumer.last_name,
            national_id=db_consumer.national_id,
            address=db_consumer.address,
            created_at=db_consumer.created_at,
            updated_at=db_consumer.updated_at,
            full_name=db_consumer.full_name,
            additional_salary=db_consumer.additional_salary,
            address_description=db_consumer.address_description,
            car_year=db_consumer.car_year,
            city=db_consumer.city,
            district=db_consumer.district,
            club=db_consumer.club,
            governorate=db_consumer.governorate,
            guarantor_job=db_consumer.guarantor_job,
            guarantor_relationship=db_consumer.guarantor_relationship,
            house_type=db_consumer.house_type,
            job_name=db_consumer.job_name,
            marital_status=db_consumer.marital_status,
            salary=db_consumer.salary,
            work_type=db_consumer.work_type,
            company=db_consumer.company,
            activated_at=db_consumer.activated_at,
            activated_by_iam_id=db_consumer.activated_by_iam_id,
            activation_branch=db_consumer.activation_branch,
            single_payment_day=db_consumer.single_payment_day,
            origination_channel=db_consumer.origination_channel,
            classification=db_consumer.classification,
            work_phone_number=db_consumer.work_phone_number,
            company_address=db_consumer.company_address,
            home_phone_number=db_consumer.home_phone_number,
            additional_salary_source=db_consumer.additional_salary_source,
            national_id_address=db_consumer.national_id_address,
        )

        if db_credit_limit is not None:
            consumer.credit_limit = CreditLimit(
                id=db_credit_limit.id,
                consumer_id=db_consumer.id,
                value=db_credit_limit.available_credit_limit,
                created_at=db_credit_limit.created_at,
            )

        return consumer
