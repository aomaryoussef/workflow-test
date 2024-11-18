from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import GetConsumerByIamIdView
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_by_iam_id import GetConsumerByIamIdUseCase

from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="get consumer by iam id")


class GetConsumerByIamIdController(BaseController):
    def __init__(self, iam_id):
        super().__init__(BaseDB=BaseDBModel)
        self.iam_id = iam_id
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            use_case = GetConsumerByIamIdUseCase(self.consumer_repository)
            output_dto = use_case.execute(self.iam_id)

            if not output_dto:
                return GetConsumerByIamIdView.not_found()

            return GetConsumerByIamIdView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to get consumer by iam id %s" % str(exception))
            return GetConsumerByIamIdView.show_error(exception)
