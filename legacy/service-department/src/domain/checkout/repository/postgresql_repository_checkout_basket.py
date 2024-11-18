""" Module for Postgresql Checkout Basket Repository
"""

from sqlalchemy import func, select
from src.services.postgresql import generate_db_session
from sqlalchemy.exc import DataError, IntegrityError, SQLAlchemyError
from typing import Optional, List, Dict
from uuid import UUID
import structlog
from src.utils.parse_postgres_error import parse_error_message
from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)
from src.domain.checkout.models.checkout_basket import CheckoutBasket, CheckoutBasketStatus
from src.domain.checkout.database.postgresql_models import CheckoutBasketDBModel


logger = structlog.get_logger()
logger = logger.bind(service="checkout", context="repository", action="postgresql")


class CheckoutBasketPostgresqlRepository(CheckoutBasketRepositoryInterface):
    """Postgresql repository for Checkout Basket"""

    def __init__(self) -> None:
        logger.debug("init")
        logger.info("init")
        self.__Session = generate_db_session()

    def find_by_session_basket_id(self, session_basket_id: UUID) -> Optional[CheckoutBasket]:
        logger.debug("find_by_session_basket_id")
        try:
            with self.__Session.begin() as session:
                db_basket = session.query(CheckoutBasketDBModel).filter_by(session_basket_id=session_basket_id).first()
                return self._to_checkout_basket_model(db_basket) if db_basket is not None else None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_by_basket_id(self, basket_id: UUID) -> Optional[CheckoutBasket]:
        logger.debug("find_by_basket_id")
        try:
            with self.__Session.begin() as session:
                db_basket = session.query(CheckoutBasketDBModel).filter_by(id=basket_id).first()
                return self._to_checkout_basket_model(db_basket) if db_basket is not None else None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_by_loan_id(self, loan_id: UUID) -> Optional[CheckoutBasket]:
        logger.debug("find_by_loan_id")
        try:
            with self.__Session.begin() as session:
                db_basket = session.query(CheckoutBasketDBModel).filter_by(loan_id=loan_id).first()
                return self._to_checkout_basket_model(db_basket) if db_basket is not None else None
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_checkout_baskets(self, partner_id: UUID, limit: int, page_number: int) -> List[CheckoutBasket]:
        logger.debug("get_checkout_baskets")
        try:
            with self.__Session.begin() as session:
                offset = limit * (page_number - 1)
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.partner_id.__eq__(partner_id))
                    .where(CheckoutBasketDBModel.selected_commercial_offer_id.is_not(None))
                    .limit(limit)
                    .offset(offset)
                )
                result = session.execute(statement).scalars().all()
                return [self._to_checkout_basket_model(db_basket) for db_basket in result]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []

    def get_checkout_baskets_count(self, partner_id: UUID, statuses: [CheckoutBasketStatus]) -> int:
        logger.debug("get_checkout_baskets_count")
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(func.count("*"))
                    .where(CheckoutBasketDBModel.partner_id.__eq__(partner_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                )
                result = session.execute(statement).scalar_one()
                return result
        except SQLAlchemyError as error:
            logger.error(str(error))
            return 0

    def save_checkout_basket(self, checkout_basket: CheckoutBasket) -> Optional[CheckoutBasket]:
        logger.debug("save_checkout_basket")
        db_basket = CheckoutBasketDBModel(
            id=checkout_basket.id,
            partner_id=checkout_basket.partner_id,
            cashier_id=checkout_basket.cashier_id,
            branch_id=checkout_basket.branch_id,
            consumer_id=checkout_basket.consumer_id,
            session_basket_id=checkout_basket.session_basket_id,
            products=checkout_basket.products,
            commercial_offers=checkout_basket.commercial_offers,
            gross_basket_value=checkout_basket.gross_basket_value,
            selected_commercial_offer_id=checkout_basket.selected_commercial_offer_id,
            consumer_device_metadata=checkout_basket.consumer_device_metadata,
            status=checkout_basket.status,
            workflow_id=checkout_basket.workflow_id,
            category=checkout_basket.category,
            origination_channel=checkout_basket.origination_channel,
            loan_id=checkout_basket.loan_id,
            transaction_id=checkout_basket.transaction_id,
        )

        try:
            with self.__Session() as session:
                db_basket = session.merge(db_basket)
                session.add(db_basket)
                session.commit()
                session.refresh(db_basket)
                return self._to_checkout_basket_model(db_basket)
        except (IntegrityError, DataError) as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def _to_checkout_basket_model(
        self,
        db_checkout_basket: CheckoutBasketDBModel,
    ) -> CheckoutBasket:
        return CheckoutBasket(
            id=db_checkout_basket.id,
            workflow_id=db_checkout_basket.workflow_id,
            partner_id=db_checkout_basket.partner_id,
            cashier_id=db_checkout_basket.cashier_id,
            branch_id=db_checkout_basket.branch_id,
            consumer_id=db_checkout_basket.consumer_id,
            session_basket_id=db_checkout_basket.session_basket_id,
            products=db_checkout_basket.products,
            commercial_offers=db_checkout_basket.commercial_offers,
            gross_basket_value=db_checkout_basket.gross_basket_value,
            consumer_device_metadata=db_checkout_basket.consumer_device_metadata,
            selected_commercial_offer_id=db_checkout_basket.selected_commercial_offer_id,
            status=db_checkout_basket.status,
            created_at=db_checkout_basket.created_at,
            updated_at=db_checkout_basket.updated_at,
            loan_id=db_checkout_basket.loan_id,
            category=db_checkout_basket.category,
            transaction_id=db_checkout_basket.transaction_id,
            origination_channel= db_checkout_basket.origination_channel,
        )

    def find_by_workflow_id(self, workflow_id: str) -> Optional[CheckoutBasket]:
        logger.debug("find_by_workflow_id")
        try:
            with self.__Session.begin() as session:
                statement = select(CheckoutBasketDBModel).where(CheckoutBasketDBModel.workflow_id.__eq__(workflow_id))
                result = session.execute(statement).scalar()
                return self._to_checkout_basket_model(result)
        except DataError as exception:
            error_message = str(exception.orig)
            field_name, error_type = parse_error_message(error_message)
            raise ValueError({field_name: error_type})
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def get_commercial_offers(self, session_basket_id: UUID) -> Optional[List[Dict[str, any]]]:
        logger.debug("get_commercial_offers")
        try:
            with self.__Session.begin() as session:
                statement = select(CheckoutBasketDBModel).where(
                    CheckoutBasketDBModel.session_basket_id.__eq__(session_basket_id)
                )
                result = session.execute(statement).scalar()
                commercial_offers_exist = result.commercial_offers is not None
                if result is not None and commercial_offers_exist:
                    return result.commercial_offers
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_by_cashier_id(
        self, cashier_id: UUID, checkout_basket_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[List[CheckoutBasket]]:
        logger.debug("find_by_cashier_id")
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.cashier_id.__eq__(cashier_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                    .where(CheckoutBasketDBModel.id != checkout_basket_id)
                )
                db_checkout_baskets = session.scalars(statement).all()
                return [self._to_checkout_basket_model(result) for result in db_checkout_baskets]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []

    def find_by_consumer_id(
        self, consumer_id: UUID, checkout_basket_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[List[CheckoutBasket]]:
        logger.info("start find_by_consumer_id query")
        try:
            logger.info("start database session")
            with self.__Session.begin() as session:
                logger.info("prepare database statement")
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.consumer_id.__eq__(consumer_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                    .where(CheckoutBasketDBModel.id != checkout_basket_id)
                )
                logger.info("start statement execution")
                db_checkout_baskets = session.scalars(statement).all()
                logger.info("got result from database")
                return [self._to_checkout_basket_model(result) for result in db_checkout_baskets]
        except SQLAlchemyError as error:
            logger.info("database error occurred")
            logger.error(str(error))
            return []

    def find_by_consumer_id_and_status(
        self, consumer_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[CheckoutBasket]:
        logger.debug("find_by_consumer_id")
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.consumer_id.__eq__(consumer_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                )
                result = session.execute(statement).scalar_one_or_none()
                if result is None:
                    return None
                return self._to_checkout_basket_model(result)
        except SQLAlchemyError as error:
            logger.error(str(error))
            return None

    def find_all_for_partner_by_statuses(
        self, partner_id: UUID, statuses: [CheckoutBasketStatus], limit: int, page_number: int
    ) -> List[CheckoutBasket]:
        logger.debug("find_all_for_partner_by_statuses")
        try:
            with self.__Session.begin() as session:
                offset = limit * (page_number - 1)
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.partner_id.__eq__(partner_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                    .limit(limit)
                    .offset(offset)
                    .order_by(CheckoutBasketDBModel.created_at.desc())
                )
                db_checkout_baskets = session.scalars(statement).all()
                return [self._to_checkout_basket_model(result) for result in db_checkout_baskets]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []

    def find_all_for_consumer_by_statuses(
        self, consumer_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> List[CheckoutBasket]:
        logger.debug("find_all_for_consumer_by_statuses")
        try:
            with self.__Session.begin() as session:
                statement = (
                    select(CheckoutBasketDBModel)
                    .where(CheckoutBasketDBModel.consumer_id.__eq__(consumer_id))
                    .where(CheckoutBasketDBModel.status.in_(statuses))
                )
                db_checkout_baskets = session.scalars(statement).all()
                return [self._to_checkout_basket_model(result) for result in db_checkout_baskets]
        except SQLAlchemyError as error:
            logger.error(str(error))
            return []
