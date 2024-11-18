from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_by_id import GetConsumerByIdUseCase
from src.domain.consumer.dtos.get_consumer_by_id_dtos import InputDto, OutputDto

from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="get consumer by id")


class GetConsumerByIdController(BaseController):
    def __init__(self, id):
        super().__init__(BaseDB=BaseDBModel)
        self.id = id
        self.input_dto = InputDto(id=id)
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            use_case = GetConsumerByIdUseCase(self.consumer_repository, self.input_dto)
            output_dto: OutputDto = use_case.execute()
            result = ConsumerViews.show(output_dto)
        except Exception as exception:
            result = ConsumerViews.error(exception)
        return result
