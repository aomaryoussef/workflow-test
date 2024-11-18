import uuid
from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from src.exceptions.exceptions import CreationError
from src.models.iscore import IScore
from src.models.iscore_raw_response import IScoreRawResponse
from src.models.model import Model
from sqlalchemy.exc import SQLAlchemyError
from src.config.logging import logger

logger = logger.bind(service="iscore", context="repository", action="iscore")


class IScoreRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, iscore_id: UUID) -> IScore or None:
        """
        Retrieve iscore by its UUID.

        Args:
            iscore_id (UUID): The UUID of iscore.

        Returns:
            IScore or None: The iscore if found, None otherwise
        """
        try:
            iscore = self.session.query(IScore).filter(IScore.id == iscore_id).first()
            if iscore is None:
                logger.debug(f"iscore with id {iscore} not found")
                return None
            return iscore
        except SQLAlchemyError as err:
            logger.error(f"error fetching iscore by id", iscore=iscore_id, error=err)
            return None

    def get_by_consumer_id(self, consumer_id: UUID) -> IScore or None:
        """
        Retrieve iscore by consumer_id.

        Args:
            consumer_id (UUID): Consumer id.

        Returns:
            IScore or None: The iscore if found, None otherwise
        """
        try:
            iscore = self.session.query(IScore).filter(IScore.consumer_id == consumer_id).first()
            if iscore is None:
                logger.debug(f"iscore with id {iscore} not found")
                return None
            return iscore
        except SQLAlchemyError as err:
            logger.error(f"error fetching iscore by consumer_id", consumer_id=consumer_id, error=err)
            return None

    def get_by_consumer_ssn(self, consumer_ssn: str) -> IScore or None:
        """
        Retrieve iscore by consumer_ssn and iscore_id is None. Read always the parent iscore, not the child.

        Args:
            consumer_ssn (str): Consumer SSN.

        Returns:
            IScore or None: The iscore if found, None otherwise
        """
        try:
            iscore = self.session.query(IScore).filter(
                IScore.consumer_ssn == consumer_ssn,
                IScore.iscore_id == None
            ).first()
            if iscore is None:
                logger.debug(f"iscore with id {iscore} not found")
                return None
            return iscore
        except SQLAlchemyError as err:
            logger.error(f"error fetching iscore by consumer_ssn", consumer_ssn=consumer_ssn, error=err)
            return None

    def create(self, iscore: IScore) -> Optional[IScore]:
        """
        Create a new iscore.

        Args:
            iscore (IScore): The iscore to create.

        Returns:
            Optional[IScore]: The created model.

        Raises:
            CreationError: If an error occurs while creating iscore.
        """
        try:
            self.session.add(iscore)
            self.session.commit()
            self.session.refresh(iscore)
            logger.debug(f"iscore with id {iscore.id} created successfully")
            return iscore
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating iscore", error=err)
            raise CreationError(f"Oops, something went wrong while creating iscore")

    def create_iscore_and_raw_response(
            self,
            iscore: IScore,
            iscore_raw_response: IScoreRawResponse
    ) -> Optional[IScore]:
        """
        Create a new iscore and iscore_raw_response as one transaction.

        Args:
            iscore (IScore): The iscore to create.
            iscore_raw_response (IScoreRawResponse): The iscore_raw_response to create.

        Returns:
            Optional[IScore]: The created model.

        Raises:
            CreationError: If an error occurs while creating iscore.
        """
        try:
            iscore_id = uuid.uuid4()
            iscore.id = iscore_id
            iscore_raw_response.iscore_id = iscore_id
            self.session.add(iscore)
            self.session.add(iscore_raw_response)
            self.session.commit()
            self.session.refresh(iscore)
            logger.debug(f"iscore with id {iscore.id} created successfully")
            return iscore
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating iscore", error=err)
            raise CreationError(f"Oops, something went wrong while creating iscore")
