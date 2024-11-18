from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.use_cases.mark_set_password import (
    MarkSetPasswordUseCase,
)
from src.domain.consumer.dtos.mark_set_password_dtos import InputDto, OutputDto
from src.domain.consumer.repository.postgresql_repository_consumer import (
    ConsumerPostgresqlRepository,
)


from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="mark set password")


class MarkSetPasswordController(BaseController):
    def __init__(self, iam_id: str):
        super().__init__(BaseDB=BaseDBModel)
        self.repository = ConsumerPostgresqlRepository()
        self.input_dto = InputDto(iam_id=iam_id)

    def execute(self):
        logger.debug("execute")
        logger.debug(f"iam_id: {self.input_dto.iam_id}")
        use_case = MarkSetPasswordUseCase(self.repository, self.input_dto)
        output_dto: OutputDto = use_case.execute()
        return ConsumerViews.show(output_dto)
