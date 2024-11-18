from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import GetConsumerLoansView
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_loans import GetConsumerLoansUseCase
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository

from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="get consumer loans")


class GetConsumerLoansController(BaseController):
    def __init__(self, consumer_id: UUID):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_id = consumer_id
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.partner_repository = PartnerRepository()

    def execute(self):
        try:
            logger.debug("execute")
            use_case = GetConsumerLoansUseCase(self.consumer_repository, self.partner_repository, self.consumer_id)
            output_dto = use_case.execute()
            return GetConsumerLoansView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to get consumer loans %s" % str(exception))
            return GetConsumerLoansView.show_error(exception)
