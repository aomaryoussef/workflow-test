from typing import Optional
from datetime import datetime, timedelta
from src.services.logging import logger
from dataclasses import dataclass
from src.services.scoring_engine import ScoringEngine
from src.services.sms_handler import SMSHandler
from src.utils.kratos import Kratos, KratosIdentitySchema
from src.domain.consumer.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.consumer.models.consumer import Consumer, ConsumerStatus
from src.domain.consumer.models.credit_limit import CreditLimit
from src.utils.exceptions import (
    ResourceNotCreatedException,
    ServiceUnAvailableException,
    ConflictException,
    FailedToProcessRequestException,
)

logger = logger.bind(service="consumer", context="use case", action="create consumer identity")


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    phone_number: Optional[str] = None
    ssn: Optional[str] = None


@dataclass
class OutputDto(BaseOutputDto):
    identity: str
    recovery_code: str
    flow_id: str


class CreateConsumerUseCase:
    def __init__(self, repo: ConsumerRepositoryInterface, input_dto: InputDto):
        self.iam = Kratos
        self.repo = repo
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        try:
            identity = self.iam.get_identity_by_identifier(self.input_dto.phone_number)
            if identity is not None:
                password_created = identity.get("traits", {}).get("password_created", True)
                logger.error(f"Identity already exists in ory for phone number {self.input_dto.phone_number}")
                exception = ConflictException("Identity already exists")
                exception.phone_number = self.input_dto.phone_number
                exception.identity_conflict = True
                exception.mc_conflict = False
                exception.password_created = password_created
                raise exception

            scoring_engine_response = None
            # First check, if the data being sent has the phone number only
            if self.input_dto.ssn is None and self.input_dto.phone_number is not None:
                try:
                    scoring_engine_response = ScoringEngine.getConsumerCreditLimit(
                        phone_number=self.input_dto.phone_number[2:]
                    )
                except ConflictException as exception:
                    # This means that this phone number exists for multiple users in the scoring engine
                    exception = ConflictException("Multiple users found with the same phone number")
                    exception.phone_number = self.input_dto.phone_number
                    exception.identity_conflict = False
                    exception.mc_conflict = True
                    exception.password_created = False
                    raise exception
            # Second check, if the data being sent has both the phone number and the ssn
            elif self.input_dto.phone_number is not None and self.input_dto.ssn is not None:
                scoring_engine_response = ScoringEngine.getConsumerCreditLimit(
                    phone_number=self.input_dto.phone_number[2:], ssn=self.input_dto.ssn
                )
            else:
                # Invalid input, at least the phone number must be passed in
                error_message = "Invalid input, at least phone_number must be passed"
                logger.error(error_message)
                raise FailedToProcessRequestException(error_message)
            identity_id = self.iam.create_identity(
                kratos_schema=KratosIdentitySchema.PHONE,
                identifier=self.input_dto.phone_number,
            )
            if identity_id is None:
                raise ResourceNotCreatedException("Identity not created")
            kratos_response = self.iam.create_recovery_code(identity_id)
            flow_id = kratos_response.get("flow_id")
            recovery_code = kratos_response.get("recovery_code")
            status = ConsumerStatus.WAITING_LIST
            credit_limit = CreditLimit(value=0)
            ssn = None
            if scoring_engine_response.user_exists:
                logger.debug("Consumer is mini cash customer")
                creation_date = self._convert_to_date(scoring_engine_response.creation_date)
                credit_limit = CreditLimit(
                    value=self._resolve_credit_limit_from_mc(scoring_engine_response.credit_limit))
                if scoring_engine_response.status == "DECLINED":
                    logger.debug(
                        "consumer is blocked due to declined status",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.BLOCKED
                elif scoring_engine_response.classification in ["N2", "C", "C1"]:
                    logger.debug(
                        "consumer is blocked due to classification, it's either N2,C,C1",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.BLOCKED
                elif scoring_engine_response.classification == "E" and scoring_engine_response.credit_limit >= 20000:
                    logger.debug(
                        "consumer is marked as AWAITING_ACTIVATION with status E and CL above 20,000",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.AWAITING_ACTIVATION
                elif scoring_engine_response.classification == "E" and scoring_engine_response.credit_limit < 20000:
                    logger.debug(
                        "consumer is marked as WAITING_LIST with status E and CL below 20,000",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.WAITING_LIST
                elif scoring_engine_response.credit_limit == 0 and self._is_more_than_two_years_old(creation_date):
                    logger.debug(
                        "consumer is marked as WAITING_LIST with CL 0 and creation date more than 2 years old",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.WAITING_LIST
                elif scoring_engine_response.credit_limit == 0 and not self._is_more_than_two_years_old(creation_date):
                    logger.debug(
                        "consumer is marked as BLOCKED with CL 0 and creation date less than 2 years old",
                        status=scoring_engine_response.status,
                        classification=scoring_engine_response.classification,
                        creation_date=scoring_engine_response.creation_date,
                        credit_limit=scoring_engine_response.credit_limit,
                        identity_id=identity_id
                    )
                    status = ConsumerStatus.BLOCKED
                # Otherwise, set the consumer status to AWAITING_ACTIVATION
                else:
                    status = ConsumerStatus.AWAITING_ACTIVATION
            else:
                logger.debug("Consumer is not mini cash customer")
            ssn = self.input_dto.ssn

            consumer = Consumer(
                iam_id=identity_id,
                status=status,
                phone_number=self.input_dto.phone_number,
                national_id=ssn,
                classification=scoring_engine_response.classification,
            )
            consumer.credit_limit = credit_limit
            consumer = self.repo.create_consumer(consumer)
            if consumer is None:
                raise ResourceNotCreatedException("Consumer not created")
            SMSHandler(self.input_dto.phone_number).send_sms(otp_code=recovery_code, template_type="consumer")
            output_dto = OutputDto(identity=identity_id, recovery_code=recovery_code, flow_id=flow_id)
            return output_dto

        except ServiceUnAvailableException as exception:
            raise exception

    def _resolve_credit_limit_from_mc(self, credit_limit: int) -> int:
        """
        Resolves the credit limit based on the scoring engine response.
        If the credit limit is not an integer, it returns 0.
        Returns the credit limit multiplied by 100 if it's greater than or equal to 0.0.
        """
        # check if credit_limit is an integer
        if not isinstance(credit_limit, int):
            logger.debug(f"Credit limit is not an integer {credit_limit}, type: {type(credit_limit)}")
            return 0
        return credit_limit * 100 if credit_limit >= 0.0 else credit_limit

    def _convert_to_date(self, date_string: str) -> datetime or None:
        """
        Converts a date string in 'yyyy-MM-dd' format to a datetime object.
        """
        try:
            logger.debug(f"Converting date string {date_string} to datetime object")
            return datetime.strptime(date_string, "%Y-%m-%d")
        except Exception as exception:
            logger.error(f"Failed to convert date string {date_string} to datetime object {str(exception)}")
            return None

    def _is_more_than_two_years_old(self, date: datetime) -> bool:
        """
        Checks if the given date is more than two years old from the current date.
        If the date is wrong format or None, it returns False anyway.
        """
        try:
            two_years_ago = datetime.now() - timedelta(days=730)  # 730 days is approximately 2 years
            return date < two_years_ago
        except Exception as err:
            logger.error(f"failed to check if date is more than two years old {str(err)}")
            return False
