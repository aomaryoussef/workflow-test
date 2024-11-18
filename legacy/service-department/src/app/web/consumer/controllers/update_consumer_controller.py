from src.domain.consumer.dtos.update_consumer_dto import UpdateConsumerInputDto
from src.app.web.base.controller import BaseController
from src.domain.consumer.database.postgresql_models import BaseDBModel
from src.app.web.consumer.views.consumer import ConsumerViews
from src.domain.consumer.use_cases.update_consumer import UpdateConsumerUseCase
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.services.logging import logger

logger = logger.bind(service="consumer", context="controller", action="update consumer")


class UpdateConsumerController(BaseController):
    def __init__(self, consumer_input):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto = UpdateConsumerInputDto
        self.json_input = consumer_input
        self.repository = ConsumerPostgresqlRepository()

    def execute(self):
        """Execute the update consumer"""
        logger.debug("execute")
        try:
            self.input_dto = UpdateConsumerInputDto(
                full_name=self.json_input.get("full_name"),
                national_id=self.json_input.get("national_id"),
                id=self.json_input.get("id"),
                address=self.json_input.get("address"),
                job_name=self.json_input.get("job_name"),
                work_type=self.json_input.get("work_type"),
                club=self.json_input.get("club"),
                house_type=self.json_input.get("house_type"),
                city=self.json_input.get("city"),
                district=self.json_input.get("district"),
                governorate=self.json_input.get("governorate"),
                salary=self.json_input.get("salary"),
                additional_salary=self.json_input.get("additional_salary"),
                address_description=self.json_input.get("address_description"),
                guarantor_job=self.json_input.get("guarantor_job"),
                guarantor_relationship=self.json_input.get("guarantor_relationship"),
                car_year=self.json_input.get("car_year"),
                marital_status=self.json_input.get("marital_status"),
                company=self.json_input.get("company"),
                single_payment_day=self.json_input.get("single_payment_day"),
                classification=self.json_input.get("classification"),
                additional_salary_source=self.json_input.get("additional_salary_source"),
                company_address=self.json_input.get("company_address"),
                home_phone_number=self.json_input.get("home_phone_number"),
                national_id_address=self.json_input.get("national_id_address"),
                work_phone_number=self.json_input.get("work_phone_number"),
            )
            use_case = UpdateConsumerUseCase(self.repository, self.input_dto)
            output_dto = use_case.execute()
            return ConsumerViews.show(output_dto)
        except Exception as exception:
            return ConsumerViews.error(exception)
