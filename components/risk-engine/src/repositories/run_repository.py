from sqlalchemy.exc import SQLAlchemyError

from src.config.logging import logger
from sqlalchemy.orm import Session
from src.models.run import Run
from src.exceptions.exceptions import CreationError

logger = logger.bind(service="run", context="repository", action="run")


class RunRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data_obj: Run) -> Run:
        """
        Create a new run.

        Args:
            data_obj (Run): The Run object to create.

        Returns:
            Run: The created Run object.

        Raises:
            CreationError: An error occurred while creating the Run.
        """
        try:
            self.session.add(data_obj)
            self.session.commit()
            self.session.refresh(data_obj)
            logger.debug(f"run with id {data_obj.id} created successfully.")
            return data_obj
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating run", error=err)
            raise CreationError(f"Oops, something went wrong while creating run")
