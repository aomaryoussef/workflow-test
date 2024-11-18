from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.use_cases.create_consumer import CreateConsumerUseCase, InputDto, OutputDto
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="create consumer identity")


class CreateConsumerController(BaseController):
    def __init__(self, phone_number: str = None, ssn: str = None):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto = InputDto(
            phone_number=phone_number if phone_number.startswith("+2") else "+2" + phone_number, ssn=ssn
        )
        self.repository = ConsumerPostgresqlRepository()

    def execute(self):
        """Execute the get commercial offers"""
        logger.debug("execute")
        try:
            use_case = CreateConsumerUseCase(repo=self.repository, input_dto=self.input_dto)
            output_dto: OutputDto = use_case.execute()
            return ConsumerViews.show_created(output_dto)
        except Exception as exception:
            return ConsumerViews.error(exception)