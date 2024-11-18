import pandas as pd
import time
from config.settings import settings
from sqlalchemy.orm import Session
from src.ml.models.pd_model import PDModel
from src.models.run import RunStatusType
from src.repositories.model_repository import ModelRepository
from src.repositories.run_repository import RunRepository
from src.services.base_model_service import BaseModelService
from src.utils.decorators import log_method_call

model_name = settings.get("pd_model", default={}).get("name")
model_version = settings.get("pd_model", default={}).get("version")


class PDModelService(BaseModelService):
    """
    Service class for handling operations related to the PDModel.

    This class extends the BaseModelService to provide specific implementations
    for predicting results using the PDModel. It handles the entire lifecycle
    of model execution, including logging the run details.
    """

    def __init__(self, session: Session = None, **kwargs):
        """
        Initializes the PDModelService with the provided session and repositories.

        Args:
            session (Session, optional): SQLAlchemy session for database operations. Defaults to None.
            kwargs: Additional keyword arguments passed to the base class.
        """
        # Initialize the base class with the specified repositories
        super().__init__(session, [ModelRepository, RunRepository], **kwargs)

    @log_method_call
    def execute(self, df: pd.DataFrame) -> float:
        """
        Executes the PDModel to predict the outcome based on the provided DataFrame.

        Args:
            df (pd.DataFrame): Input DataFrame containing the data for prediction.

        Returns:
            float: The prediction result from the PDModel.

        Raises:
            ModelExecutionError: If there is an error during the model execution, it is logged and raised.
        """
        # Retrieve the model ID based on the model name and version
        model = self.get_model(model_name, model_version)
        params = model.parameters

        # Record the start time for execution duration measurement
        start_time = time.time()
        res: float or None = None
        error = None

        try:
            # Attempt to predict using the PDModel
            res = PDModel(parameters=params).predict(df)
            status = RunStatusType.SUCCESS
        except Exception as err:
            # If prediction fails, capture the error and set status to FAILED
            status = RunStatusType.FAILED
            error = err

        # Calculate the execution duration in milliseconds
        duration = int((time.time() - start_time) * 1000)

        # Log the run details including the input, output, and duration
        # if an error occurred, log_run will raise it
        self.log_run(
            model_id=model.id,
            input_data=df,
            output_data=res,
            duration=duration,
            status=status,
            error=error
        )

        return res
