from datetime import datetime
from src.config.logging import logger
from sqlalchemy.orm import Session
from src.exceptions.exceptions import CreationError
from src.models.request import Request
from src.repositories.job_salary_repository import JobSalaryRepository
from src.repositories.model_repository import ModelRepository
from src.repositories.request_repository import RequestRepository
from src.services.base_repository_service import BaseRepositoryService
from src.services.calculation_center_model_service import CalculationCenterModelService
from src.services.feature_store_service import FeatureStoreService
from src.services.income_model_service import IncomeModelService
from src.services.iscore_service import IScoreService
from src.services.pd_model_service import PDModelService
from src.utils.data_helpers import convert_to_builtin_types
from src.utils.decorators import log_method_call
from src.utils.monetary import AmountInCents  # Import the conversion helper

logger = logger.bind(service="scoring_service", context="service", action="scoring_service")


class ScoringService(BaseRepositoryService):
    model_repository: ModelRepository
    request_repository: RequestRepository

    def __init__(self, session: Session = None):
        super().__init__(session, [ModelRepository, RequestRepository])
        self.metadata = {
            "request_id": None,
            "booking_time": None,
        }

    @log_method_call
    def get_score(self, raw_data: dict, **kwargs):
        application_data = raw_data["data"]
        scenario = raw_data['scenario']
        booking_time = self._get_booking_time(kwargs)
        request = self._create_request(application_data, scenario, raw_data, booking_time)

        self.metadata["request_id"] = request.id
        self.metadata["booking_time"] = booking_time

        # Apply transformation to the application data   
        application_data = self._convert_monetary_fields_to_pounds(application_data) # Encapsulate conversion from cents to pounds
        application_data = self.add_score_scenario(application_data, scenario) # Add scoring scenario to application data
        application_data = self._populate_iscore(application_data)
        application_data = self._add_job_salary_data(application_data)

        # Run core services
        df = self._generate_feature_store(application_data)
        df = self._run_income_prediction(df)
        df = self._run_pd_prediction(df)

        result = self._run_calculation_center(df)

        masked_ssn = "********" + application_data['ssn'][7:]
        logger.info("scoring completed", consumer_id=str(application_data['client_id']), ssn=masked_ssn,
                    scenario=scenario)

        return result

    def _get_booking_time(self, kwargs):
        booking_time = kwargs.get('booking_time')
        if booking_time is None:
            booking_time = datetime.now()
            logger.debug("booking time is not passed, generating current time", booking_time=booking_time)
        return booking_time

    def _create_request(self, application_data: dict, scenario: str, raw_data: dict, booking_time: datetime) -> Request:
        """
        Creates a new request record in the database and logs the creation process.
        Args:
            application_data (dict): The data related to the application, including client information and scenario details.
            scenario (str): The scenario under which the request is being processed (e.g., 'SCORING').
            raw_data (dict): The raw input data that needs to be stored in the request.
            booking_time (datetime): The time at which the booking is recorded.
        Returns:
            Request: The newly created Request object containing all relevant data.
        Raises:
            CreationError: If there is an error during the creation of the Request, likely due to a database issue.
        """
        try:
            consumer_id = application_data['client_id']

            # Create a new Request object with the provided data
            request = self.request_repository.create(Request(
                consumer_id=consumer_id,
                scenario=scenario,
                input_data=convert_to_builtin_types(raw_data), # Convert raw data to a serializable format
                booking_time=booking_time
            ))

            # Mask the SSN for logging purposes (e.g., '********891234')
            masked_ssn = "********" + application_data['ssn'][7:]
            logger.info("Request created", consumer_id=str(consumer_id), ssn=masked_ssn, scenario=scenario)

            return request

        except Exception as err:
            logger.error("Error creating Request", error=err)
            raise CreationError(
                "Error creating Request. The issue might be due to an incomplete database operation"
            )
    
    # TODO: Are we passing this in a standard/correct way?
    def add_score_scenario(self, application_data, scenario) -> dict:
        application_data['scoring_scenario'] = scenario
        return application_data

    def _populate_iscore(self, application_data: dict) -> dict:
        """
        Retrieves and processes IScore data for the given application data.
        Args:
            application_data (dict): The application data which may contain IScore information.
        Modifies:
            application_data (dict): Updates the dictionary with IScore information and flags.
        """
        iscore = application_data.pop("iscore", {})
        consumer_id = application_data.get("client_id")
        consumer_ssn = application_data.get("ssn")
        
        # Set 'is_iscore' flag based on the presence of IScore data from application as input
        application_data['is_iscore'] = 1 if iscore else 0

        if not iscore:
            # IScore data is not present or empty, retrieve it from the IScoreService
            iscore = IScoreService(**self.metadata).get_iscore(consumer_id=consumer_id, consumer_ssn=consumer_ssn)
            if iscore.iscore_score is not None and iscore.iscore_report is not None:
                application_data['iscore_score'] = iscore.iscore_score
                application_data['iscore_report'] = str(iscore.iscore_report)
                application_data['is_iscore'] = 1
            else:
                logger.debug("IScore data is empty")
                # set the IScore data to None if it is empty, the models expects these fields to be present
                application_data['iscore_score'] = None
                application_data['iscore_report'] = None
        else:
            # Flatten the existing IScore data
            application_data['iscore_score'] = iscore.get('iscore_score')
            application_data['iscore_report'] = str(iscore.get('iscore_report'))
        return application_data

    def _add_job_salary_data(self, application_data) -> dict:
        job_salary = JobSalaryRepository().get_min_and_max_by_job_map(application_data['job_name_map'])
        application_data.update(job_salary)
        return application_data

    def _generate_feature_store(self, application_data):
        return FeatureStoreService(**self.metadata).execute(application_data)

    def _run_income_prediction(self, df):
        df['income_predics'] = IncomeModelService(**self.metadata).execute(df)
        return df

    def _run_pd_prediction(self, df):
        df['pd_predics'] = PDModelService(**self.metadata).execute(df)
        return df

    def _run_calculation_center(self, df):
        return CalculationCenterModelService(**self.metadata).execute(df)
    
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

    
    def _convert_monetary_fields_to_pounds(self, application_data: dict) -> dict:
        """
        Convert relevant monetary fields from cents to pounds for internal processing.
        """
        net_income_cents = application_data.get("net_income", 0)  # Handle as plain integers
        net_burden_cents = application_data.get("net_burden", 0)

        net_income_pounds = AmountInCents.to_pounds(net_income_cents)  # Convert to pounds
        net_burden_pounds = AmountInCents.to_pounds(net_burden_cents)

        # Update application_data to use pounds
        application_data["net_income"] = net_income_pounds
        application_data["net_burden"] = net_burden_pounds

        return application_data
