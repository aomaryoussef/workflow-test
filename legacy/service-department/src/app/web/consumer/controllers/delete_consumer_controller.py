from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import DeleteConsumerView
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)
from src.domain.consumer.use_cases.delete_consumer import DeleteConsumerUseCase


from src.services.logging import logger


logger = logger.bind(service="consumer", context="controller", action="delete consumer")


class DeleteConsumerController(BaseController):
    def __init__(self, phone_number: str):
        super().__init__(BaseDB=BaseDBModel)
        self.phone_number = phone_number
        self.repository = ConsumerPostgresqlRepository()

    def execute(self):
        """Execute delete consumer"""
        logger.debug("execute")
        try:
            use_case = DeleteConsumerUseCase(self.repository, self.phone_number)
            output_dto = use_case.execute()
            return DeleteConsumerView.show(output_dto)
        except Exception as exception:
            logger.error("Consumer not deleted with exception %s" % str(exception))
            return DeleteConsumerView.show_error(exception)
