import inspect
import pandas as pd
from typing import Any
from src.config.logging import logger
from sqlalchemy.orm import Session
from src.exceptions.exceptions import ModelExecutionError, CreationError, NotFoundError
from src.models.model import Model
from src.utils.data_helpers import convert_to_serializable
from src.repositories.model_repository import ModelRepository
from src.repositories.run_repository import RunRepository
from src.services.base_repository_service import BaseRepositoryService
from src.models.run import Run, RunStatusType

logger = logger.bind(service="base_model_service", context="service", action="Base Model")


class BaseModelService(BaseRepositoryService):
    """
    Base service class for handling model operations.

    Attributes:
        model_repository (ModelRepository): Repository for model-related database operations.
        run_repository (RunRepository): Repository for run-related database operations.
        request_id (str): Unique identifier for the request.
        booking_time (datetime): Booking time for the request.
    """
    model_repository: ModelRepository
    run_repository: RunRepository

    def __init__(
            self,
            session: Session = None,
            repositories: list = None,
            **kwargs
    ):
        """
        Initialize the base model service with session and repositories.

        Args:
            session (Session): SQLAlchemy session for database operations.
            repositories (list): Repositories for model-related database operations to be initialized.
            kwargs: Additional keyword arguments.
        """
        super().__init__(session, repositories)
        self.request_id = kwargs.get('request_id')
        self.booking_time = kwargs.get('booking_time')

    def get_model(self, model_name: str, model_version: int) -> Model:
        """
        Retrieve the model ID based on model name and version.

        Args:
            model_name (str): Name of the model.
            model_version (int): Version of the model.

        Returns:
            Model: Model Object

        Raises:
            Exception: If the model is not found.
        """
        try:
            res = self.model_repository.get_by_name_and_version(model_name, model_version)
            if res is None:
                logger.error(f'Model with name {model_name} and version {model_version} could not be found')
                raise NotFoundError(
                    f'Model with name {model_name} and version {model_version} could not be found. Are you sure this is an active model')
            return res
        except Exception as err:
            logger.error(f'Error in retrieving Model with name {model_name} and version {model_version}', error=err)
            raise Exception(
                f'Error in retrieving Model with name {model_name} and version {model_version}. If problem persists, please contact the administrator.')

    def log_run(
            self,
            model_id: str,
            input_data: pd.DataFrame or dict,
            output_data: Any,
            duration: int,
            status: RunStatusType,
            error: Exception = None
    ) -> Run:
        """
        Log the run details to the repository.

        Args:
            model_id (str): ID of the model used.
            input_data (pd.DataFrame or dict): Input data for the model.
            output_data (Any): Output data from the model.
            duration (int): Execution duration in seconds.
            status (str): Status of the run (SUCCESS or FAILED).
            error (Exception, optional): Error encountered during the run, if any.
        Returns:
            Run: Run object logged in the repository.
        """
        try:
            run = self.run_repository.create(Run(
                request_id=self.request_id,
                model_id=model_id,
                input_data=convert_to_serializable(input_data),
                output_data=convert_to_serializable(output_data),
                execution_duration_ms=duration,
                status=status,
                booking_time=self.booking_time
            ))
        except Exception as log_error:
            logger.error("error creating Run", error=log_error)
            raise CreationError("Error creating Run. The issue might be due to an incomplete database operation")

        if error is not None:
            current_frame = inspect.currentframe()
            caller_frame = current_frame.f_back
            # Get the class name and method name
            class_name = caller_frame.f_locals.get('self',
                                                   None).__class__.__name__ if 'self' in caller_frame.f_locals else None
            logger.error(f"model {class_name} could not be executed", model=class_name, error=error)
            raise ModelExecutionError(f"something went wrong executing {class_name} model")
        return run

    def execute(self, df: pd.DataFrame) -> Any:
        """
        Abstract method to be implemented by subclasses for model execution.

        Args:
            df (pd.DataFrame): Input DataFrame for prediction.

        Returns:
            Any: Prediction result.

        Raises:
            NotImplementedError: If the method is not implemented by the subclass.
        """
        raise NotImplementedError("Subclasses should implement this method")
