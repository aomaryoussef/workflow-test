from src.domain.consumer.dtos.get_consumer_credit_limits_dto import GetConsumerMonthlyAvailableCreditLimitsOutputDto
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.services.logging import logger
from src.services.scoring_engine import ScoringEngine
from src.utils.exceptions import ConflictException

logger = logger.bind(service="consumer", context="use case", action="get consumer credit limits")


class GetConsumerCreditLimitsUseCase:
    def __init__(self, consumer_repository: ConsumerRepositoryInterface, consumer_id: str):
        self.consumer_repository = consumer_repository
        self.consumer_id = consumer_id

    def execute(self) -> GetConsumerMonthlyAvailableCreditLimitsOutputDto:
        logger.debug("execute")
        try:
            consumer = self.consumer_repository.get(self.consumer_id)
            if not consumer:
                logger.debug("consumer not found")
                return None
            phone_number = consumer.phone_number
            logger.debug("get available credit limit for consumer " + self.consumer_id)

            try:
                response = ScoringEngine.getConsumerCreditLimit(phone_number)
            except ConflictException:
                # This means that this phone number exists for multiple users in the scoring engine
                logger.debug("Multiple users found with the same phone number, retrieving by ssn...")
                response = ScoringEngine.getConsumerCreditLimit(
                    phone_number=phone_number, ssn=consumer.national_id
                )
            logger.debug("found consumer credit limits")
            return GetConsumerMonthlyAvailableCreditLimitsOutputDto(
                available_limit=response.credit_limit * 100, monthly_limit=0
            )
        except Exception as exception:
            logger.error("Failed to get consumer credit limits %s" % str(exception))
            raise exception
