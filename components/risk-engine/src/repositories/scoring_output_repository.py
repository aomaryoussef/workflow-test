from sqlalchemy.exc import SQLAlchemyError

from src.config.logging import logger
from sqlalchemy.orm import Session
from src.exceptions.exceptions import CreationError
from src.models.scoring_output import ScoringOutput

logger = logger.bind(service="scoring_output", context="repository", action="scoring_output")


class ScoringOutputRepository:
    def __init__(self, session: Session):
        self.session = session

    def create(self, data_obj: ScoringOutput) -> ScoringOutput:
        """
        Create a new scoring output.

        Args:
            data_obj (ScoringOutput): The scoring output to create.

        Returns:
            ScoringOutput: The created scoring output if successful.

        Raises:
            CreationError: An error occurred while creating the scoring output.
        """
        try:
            self.session.add(data_obj)
            self.session.commit()
            self.session.refresh(data_obj)
            logger.debug(f"scoringOutput with id {data_obj.id} created successfully")
            return data_obj
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating scoring output", error=err)
            raise CreationError(f"Oops, something went wrong while creating scoring output")
