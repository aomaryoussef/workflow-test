from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import GetConsumerByPhoneNumberView
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.consumer.use_cases.get_consumer_by_phone_number import GetConsumerByPhoneNumberUseCase

from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="get consumer by phone number")


class GetConsumerByPhoneNumberController(BaseController):
    def __init__(self, phone_number):
        super().__init__(BaseDB=BaseDBModel)
        self.phone_number = phone_number if phone_number.startswith("+2") else "+2" + phone_number
        self.consumer_repository = ConsumerPostgresqlRepository()

    def execute(self):
        try:
            logger.debug("execute")
            use_case = GetConsumerByPhoneNumberUseCase(self.consumer_repository)
            output_dto = use_case.execute(self.phone_number)

            if not output_dto:
                return GetConsumerByPhoneNumberView.not_found()

            return GetConsumerByPhoneNumberView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to get consumer by phone number %s" % str(exception))
            return GetConsumerByPhoneNumberView.show_error(exception)
