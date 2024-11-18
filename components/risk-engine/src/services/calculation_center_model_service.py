import time
import pandas as pd
from src.config.logging import logger
from config.settings import settings
from sqlalchemy.orm import Session
from src.ml.models.calculation_center_model import CalculationCenterModel
from src.models.run import RunStatusType
from src.models.scoring_output import ScoringOutput
from src.repositories.model_repository import ModelRepository
from src.repositories.run_repository import RunRepository
from src.repositories.scoring_output_repository import ScoringOutputRepository
from src.services.base_model_service import BaseModelService
from src.utils.decorators import log_method_call
from src.utils.monetary import AmountInCents  # Import the conversion utility

logger = logger.bind(service="calculation_center_service", context="service", action="Calculation Center")

model_name = settings.get("calculation_center_model", default={}).get("name")
model_version = settings.get("calculation_center_model", default={}).get("version")


class CalculationCenterModelService(BaseModelService):
    """
    Service class for handling Calculation Center Model operations.

    This class extends the BaseModelService to provide specific implementations
    for calculating results using the CalculationCenterModel. It handles the entire lifecycle
    of model execution, including logging the run details and managing scoring output.

    Attributes:
        scoringoutput_repository (ScoringOutputRepository): Repository for scoring output-related database operations.
    """
    scoringoutput_repository: ScoringOutputRepository

    def __init__(self, session: Session = None, **kwargs):
        """
        Initializes the CalculationCenterModelService with the provided session and repositories.

        Args:
            session (Session, optional): SQLAlchemy session for database operations. Defaults to None.
            kwargs: Additional keyword arguments passed to the base class.
        """
        # Initialize the base class with the specified repositories
        super().__init__(session, [ModelRepository, RunRepository, ScoringOutputRepository], **kwargs)

    @log_method_call
    def execute(self, df: pd.DataFrame) -> dict:
        """
        Executes the CalculationCenterModel to calculate the outcome based on the provided DataFrame.

        This method handles the entire process, including logging the run details and storing the scoring output.

        Args:
            df (pd.DataFrame): Input DataFrame containing the data for calculation.

        Returns:
            dict: The calculation result from the CalculationCenterModel.

        Raises:
            Exception: If there is an error during the model execution or scoring output creation, it is logged and raised.
        """
        # Retrieve the model ID based on the model name and version
        model = self.get_model(model_name, model_version)
        params = model.parameters

        # Record the start time for execution duration measurement
        start_time = time.time()
        res: dict or None = None
        error = None

        try:
            # Attempt to calculate using the CalculationCenterModel
            res = CalculationCenterModel(parameters=params).calculate(df=df)
            status = RunStatusType.SUCCESS
        except Exception as err:
            # If calculation fails, capture the error and set status to FAILED
            status = RunStatusType.FAILED
            error = err

        # Calculate the execution duration in milliseconds
        duration = int((time.time() - start_time) * 1000)

        # Log the run details including the input, output, and duration
        run = self.log_run(
            model_id=model.id,
            input_data=df,
            output_data=res,
            duration=duration,
            status=status,
            error=error
        )
        
        # Convert monetary values from pounds to cents for logging and response
        res = self._convert_monetary_fields_to_cents(res)

        # Create and log the scoring output in the repository
        self.scoringoutput_repository.create(ScoringOutput(
            consumer_ssn=str(df['ssn'].values[0]),
            consumer_id=str(df['client_id'].values[0]),
            runs_id=run.id,
            request_id=self.request_id,
            ar_status=res.get('ar_status'),
            calc_credit_limit=res.get('calc_credit_limit'),
            pd_predictions=res.get('pd_predictions'),
            income_predictions=res.get('income_predictions'),
            income_zone=res.get('income_zone'),
            final_net_income=res.get('final_net_income'),
            cwf_segment=res.get('cwf_segment'),
            cwf=res.get('cwf'),
            booking_time=self.booking_time
        ))

        return res

    def _convert_monetary_fields_to_cents(self, result: dict) -> dict:
        """
        Convert relevant fields from pounds back to cents for the API response.
        """
        calc_credit_limit_pounds = result.get("calc_credit_limit", 0)
        result["calc_credit_limit"] = AmountInCents.from_pounds(calc_credit_limit_pounds)  # Plain int, no dict

        income_predictions_pounds = result.get("income_predictions", 0)
        result["income_predictions"] = AmountInCents.from_pounds(income_predictions_pounds)

        final_net_income_pounds = result.get("final_net_income", 0)
        result["final_net_income"] = AmountInCents.from_pounds(final_net_income_pounds)

        return result