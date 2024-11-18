from uuid import UUID
from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import GetConsumerLoanDetailsView
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_loan_details import GetConsumerLoanDetailsUseCase
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository

from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="get consumer loan details")


class GetConsumerLoanDetailsController(BaseController):
    def __init__(self, consumer_id: UUID, loan_id: str, installment_id: int):
        super().__init__(BaseDB=BaseDBModel)
        self.consumer_id = consumer_id
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.partner_repository = PartnerRepository()
        self.loan_id = loan_id
        self.installment_id = installment_id

    def execute(self):
        try:
            logger.debug("execute")
            use_case = GetConsumerLoanDetailsUseCase(
                consumer_repository=self.consumer_repository,
                partner_repository=self.partner_repository,
                consumer_id=self.consumer_id,
                loan_id=self.loan_id,
                installment_id=self.installment_id,
            )
            output_dto = use_case.execute()
            return GetConsumerLoanDetailsView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to get consumer loan details %s" % str(exception))
            return GetConsumerLoanDetailsView.show_error(exception)
