from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.activate_consumer import ActivateConsumerUseCase
from src.domain.consumer.dtos.activate_consumer_dtos import InputDto, OutputDto
from src.services.logging import logger


logger = logger.bind(service="consumer", context="controller", action="activate consumer")


class ActivateConsumerController(BaseController):
    """Init Activate Consumer Controller Class"""

    def __init__(self, consumer_id: UUID, credit_limit: int, credit_officer_iam_id: str, branch_name: str):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto: InputDto = InputDto(consumer_id=UUID(consumer_id), credit_limit=credit_limit, credit_officer_iam_id=credit_officer_iam_id, branch_name=branch_name)
        self.repository = ConsumerPostgresqlRepository()

    def execute(self):
        """Execute the activate consumer controller"""
        logger.debug("execute")
        try:
            use_case = ActivateConsumerUseCase(repository=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = ConsumerViews.show(output_dto)
            return result
        except Exception as exception:
            result = ConsumerViews.error(exception)
            return result
