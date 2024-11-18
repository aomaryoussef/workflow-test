from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.domain.consumer.dtos.update_consumer_credit_limit_dto import (
    InputDto,
    OutputDto,
)

from src.domain.consumer.use_cases.update_consumer_credit_limt import (
    UpdateConsumerCreditLimitUseCase,
)
from src.services.logging import logger

logger = logger.bind(
    service="consumer", context="controller", action="update consumer credit limit"
)


class UpdateConsumerCreditLimitController(BaseController):

    def __init__(self, consumer_id, amount, direction):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto = InputDto(
            consumer_id=consumer_id, amount=amount, direction=direction
        )
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            use_case = UpdateConsumerCreditLimitUseCase(
                self.consumer_repository, self.input_dto
            )
            output_dto: OutputDto = use_case.execute()
            result = ConsumerViews.show(output_dto)
        except Exception as exception:
            result = ConsumerViews.error(exception)
        return result
