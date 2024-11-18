from sqlalchemy.exc import SQLAlchemyError

from src.config.logging import logger
from sqlalchemy.orm import Session
from src.models.request import Request
from src.exceptions.exceptions import CreationError

logger = logger.bind(service="request", context="repository", action="request")


class RequestRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data_obj: Request) -> Request:
        """
        Create a new request.

        Args:
            data_obj (Request): The request object to create.

        Returns:
            Request: The created request object.

        Raises:
            CreationError: An error occurred while creating the request.
        """
        try:
            self.session.add(data_obj)
            self.session.commit()
            self.session.refresh(data_obj)
            logger.debug(f"request with id {data_obj.id} created successfully")
            return data_obj
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating request", error=err)
            raise CreationError(f"Oops, something went wrong while creating request")
