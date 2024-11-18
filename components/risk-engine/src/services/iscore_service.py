from datetime import datetime, timedelta
from uuid import UUID
from sqlalchemy.orm import Session
from src.config.logging import logger
from config.settings import settings
from src.models.iscore import IScore
from src.adapters.external.iscore import IScoreAdapter
from src.models.iscore_raw_response import IScoreRawResponse
from src.repositories.iscore_repository import IScoreRepository
from src.schemas.iscore import IScoreCreate, IScoreStatusType, IScoreRawResponseCreate
from src.services.base_repository_service import BaseRepositoryService

logger = logger.bind(service="iscore_service", context="service", action="iscore_service")

DATA_THRESHOLD = settings.get("iscore", default={}).get("data_threshold", 180)


class IScoreService(BaseRepositoryService):
    iscore_repository: IScoreRepository

    def __init__(self, session: Session = None, **kwargs):
        """
        Initialize the IScoreService.

        Args:
            session (Session): Database session, optional.
            **kwargs: Additional keyword arguments.
                - booking_time (Optional[datetime]): Time of booking.
                - request_id (Optional[str]): Request ID.
        """
        super().__init__(session, [IScoreRepository])
        self.booking_time = kwargs.get("booking_time")
        self.request_id = kwargs.get("request_id")

    def get_by_id(self, iscore_id: UUID) -> IScore:
        """
        Retrieve IScore data by its ID.

        Args:
            iscore_id (UUID): The ID of the IScore.

        Returns:
            Optional[IScore]: The IScore object if found, else None.
        """
        return self.iscore_repository.get_by_id(iscore_id)

    def get_by_consumer_id(self, consumer_id: UUID) -> IScore:
        """
        Retrieve IScore data by consumer ID.

        Args:
            consumer_id (UUID): The consumer's ID.

        Returns:
            Optional[IScore]: The IScore object if found, else None.
        """
        return self.iscore_repository.get_by_consumer_id(consumer_id)

    def get_by_consumer_ssn(self, consumer_ssn: str) -> IScore:
        """
        Retrieve IScore data by consumer SSN.

        Args:
            consumer_ssn (str): The consumer's SSN.

        Returns:
            Optional[IScore]: The IScore object if found, else None.
        """
        return self.iscore_repository.get_by_consumer_ssn(consumer_ssn)

    def get_iscore(self, consumer_id: str, consumer_ssn: str) -> IScore:
        """
        Get and create an IScore based on consumer ID and SSN.

        This method checks if an existing IScore report is valid (less than 6 months old and with a SUCCESS status).
        If the existing report is outdated or has a non-SUCCESS status, it fetches a new report.

        Args:
            consumer_id (str): The consumer's ID.
            consumer_ssn (str): The consumer's SSN.

        Returns:
            IScore: The IScore object, either retrieved or newly created.
        """
        existing_iscore = self.get_by_consumer_ssn(consumer_ssn)

        iscore_obj = IScoreCreate(
            consumer_id=consumer_id,
            consumer_ssn=consumer_ssn,
            request_id=self.request_id,
            booking_time=self.booking_time
        )

        if existing_iscore is not None:
            # Check if the existing report is old or has a non-SUCCESS status
            if self._is_existing_report_old(
                    existing_iscore.created_at) or existing_iscore.status.value != IScoreStatusType.SUCCESS.value:
                self._update_report_from_iscore(iscore_obj, consumer_ssn)
            # Use existing data if the report is valid
            else:
                self._use_existing_iscore_data(iscore_obj, existing_iscore)
        # Fetch a new report if no existing data is found
        else:
            self._update_report_from_iscore(iscore_obj, consumer_ssn)

        return self.create_iscore_and_iscore_raw_response(iscore_obj)

    def create_iscore_and_iscore_raw_response(self, iscore: IScoreCreate) -> IScore:
        """
        Create a new IScore and IScore Raw Response entry in the repository.

        Args:
            iscore (IScoreCreate): The IScoreCreate object containing the new IScore data.

        Returns:
            Optional[IScore]: The created IScore object.
        """
        iscore_obj = IScore(
            consumer_id=iscore.consumer_id,
            consumer_ssn=iscore.consumer_ssn,
            request_id=iscore.request_id,
            iscore_id=iscore.iscore_id,
            iscore_score=iscore.iscore_score,
            iscore_report=iscore.iscore_report,
            status=iscore.status.value,
            booking_time=iscore.booking_time
        )

        iscore_raw_response_obj = IScoreRawResponse(
            request_id=iscore.request_id,
            raw_response=iscore.raw_response,
            booking_time=iscore.booking_time
        )

        return self.iscore_repository.create_iscore_and_raw_response(
            iscore=iscore_obj,
            iscore_raw_response=iscore_raw_response_obj
        )

    def create(self, iscore: IScoreCreate) -> IScore:
        """
        Create a new IScore entry in the repository.

        Args:
            iscore (IScoreCreate): The IScoreCreate object containing the new IScore data.

        Returns:
            Optional[IScore]: The created IScore object.
        """
        iscore_obj = IScore(
            consumer_id=iscore.consumer_id,
            consumer_ssn=iscore.consumer_ssn,
            request_id=iscore.request_id,
            iscore_id=iscore.iscore_id,
            iscore_score=iscore.iscore_score,
            iscore_report=iscore.iscore_report,
            status=iscore.status.value,
            booking_time=iscore.booking_time
        )

        return self.iscore_repository.create(iscore=iscore_obj)

    def _is_existing_report_old(self, iscore_created_at: datetime) -> bool:
        """
        Check if an existing IScore report is older than the threshold (6 months).

        Args:
            iscore_created_at (datetime): The creation time of the IScore.

        Returns:
            bool: True if the report is older than 6 months, else False.
        """
        data_threshold = datetime.now() - timedelta(days=int(DATA_THRESHOLD))
        is_old = iscore_created_at < data_threshold
        logger.debug(f"IScore report is {'older' if is_old else 'not older'} than 6 months.")
        return is_old

    def _update_report_from_iscore(self, iscore_obj: IScoreCreate, consumer_ssn: str):
        """
        Update the IScoreCreate object by calling the external API for a new report.

        Args:
            iscore_obj (IScoreCreate): The IScoreCreate object to update.
            consumer_ssn (str): The consumer's SSN to fetch the new report.
        """
        # Fetch the new report from the external API
        report = IScoreAdapter().get_score(consumer_ssn)

        iscore_obj.raw_response = report["raw_data"]

        if self._is_no_output(report):
            iscore_obj.status = IScoreStatusType.NO_OUTPUT
            logger.debug("IScore report successfully returned but no data found from iscore")
        elif self._is_failed(report):
            iscore_obj.status = IScoreStatusType.FAILED
            logger.debug("IScore report failed to return data")
        else:
            iscore_obj.status = IScoreStatusType.SUCCESS
            iscore_obj.iscore_score = int(report["score"])
            iscore_obj.iscore_report = report["report"]
            logger.debug("IScore report successfully returned")

    def _has_no_score_or_report(self, report):
        res = report["status"] and (report["score"] is None or report["report"] is None)
        logger.debug(f"_has_no_score_or_report: {res}")
        return res

    def _is_no_hit_header(self, report):
        try:
            res = report["score"] == 0 and report["report"][0]["ModuleId"] == "iScoreNoHitHeader"
            logger.debug(f"_is_no_hit_header: {res}")
        except Exception as e:
            logger.debug(f"failed to check if no hit header: {e}, treating as no hit header anyway...")
            # If there is an exception, consider it as no hit header
            res = True
        return res

    def _is_no_output(self, report):
        res = self._has_no_score_or_report(report) or self._is_no_hit_header(report)
        logger.debug(f"_is_no_outputs: {res}")
        return res

    def _is_failed(self, report):
        res = not report["status"]
        logger.debug(f"_is_failed: {res}")
        return res

    def _use_existing_iscore_data(self, iscore_obj: IScoreCreate, existing_iscore: IScore):
        """
        Populate the IScoreCreate object with existing IScore data.

        Args:
            iscore_obj (IScoreCreate): The IScoreCreate object to populate.
            existing_iscore (IScore): The existing IScore data.
        """
        iscore_obj.iscore_score = existing_iscore.iscore_score
        iscore_obj.iscore_report = existing_iscore.iscore_report
        iscore_obj.iscore_id = existing_iscore.id
        iscore_obj.status = existing_iscore.status
