from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import GetConsumerCreditLimitsView
from src.domain.consumer.dtos.get_consumer_credit_limits_dto import GetConsumerMonthlyAvailableCreditLimitsOutputDto
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_beta_credit_limit import GetBetaCreditLimitUseCase
from src.domain.consumer.use_cases.get_consumer_credit_limits import GetConsumerCreditLimitsUseCase
from src.domain.consumer.dtos.get_credit_limit_dto import InputDto

from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="consumer", context="controller", action="get consumer credit limits")
is_alpha_onboarding = settings.get("workflow", default={}).get("is_alpha_onboarding", default=True)


class GetConsumerCreditLimitsController(BaseController):
    def __init__(self, consumer_id: UUID):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_id = consumer_id
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            if is_alpha_onboarding:
                logger.info("Running GetBetaCreditLimitUseCase")
                use_case = GetBetaCreditLimitUseCase(self.consumer_repository, InputDto(consumer_id=self.consumer_id))
                beta_output_dto = use_case.execute()
                output_dto = GetConsumerMonthlyAvailableCreditLimitsOutputDto(available_limit=beta_output_dto.credit_limit, monthly_limit=0)
            else:
                logger.info("Running GetConsumerCreditLimitsUseCase")
                use_case = GetConsumerCreditLimitsUseCase(self.consumer_repository, self.consumer_id)
                output_dto = use_case.execute()

            if not output_dto:
                return GetConsumerCreditLimitsView.not_found()

            return GetConsumerCreditLimitsView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to get consumer credit limits %s" % str(exception))
            return GetConsumerCreditLimitsView.show_error(exception)
