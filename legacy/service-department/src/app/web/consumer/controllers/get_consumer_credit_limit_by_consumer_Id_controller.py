from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.domain.consumer.dtos.get_credit_limit_dto import InputDto, OutputDto

from src.domain.consumer.use_cases.get_credit_limit import GetCreditLimitUseCase
from src.domain.consumer.use_cases.get_beta_credit_limit import GetBetaCreditLimitUseCase

from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="consumer", context="controller", action="get consumer credit limit")
is_alpha_onboarding = settings.get("workflow", default={}).get("is_alpha_onboarding", default=True)


class GetConsumerCreditLimitByConsumerIdController(BaseController):

    def __init__(self, consumer_id):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto = InputDto(consumer_id=consumer_id)
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            if is_alpha_onboarding:
                logger.info("Running GetBetaCreditLimitUseCase")
                use_case = GetBetaCreditLimitUseCase(self.consumer_repository, self.input_dto)
            else:
                logger.info("Running GetCreditLimitUseCase")
                use_case = GetCreditLimitUseCase(self.consumer_repository, self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = ConsumerViews.show(output_dto)
        except Exception as exception:
            result = ConsumerViews.error(exception)
        return result
