import structlog
from typing import Optional
from src.domain.consumer.dtos.update_consumer_dto import (
    UpdateConsumerInputDto,
    UpdateConsumerOutputDto,
)
from src.domain.consumer.repository.repository_interface import (
    ConsumerRepositoryInterface,
)

from src.domain.consumer.models.consumer import Consumer

logger = structlog.get_logger()


class UpdateConsumerUseCase:
    def __init__(self, repo: ConsumerRepositoryInterface, input_dto: UpdateConsumerInputDto):
        self.repo = repo
        self.input_dto = input_dto

    def execute(self) -> Optional[UpdateConsumerOutputDto]:
        logger.debug("update consumer use case - execute")
        consumer = Consumer(
            id=self.input_dto.id,
            national_id=self.input_dto.national_id,
            full_name=self.input_dto.full_name,
            address=self.input_dto.address,
            work_type=self.input_dto.work_type,
            additional_salary=self.input_dto.additional_salary,
            address_description=self.input_dto.address_description,
            car_year=self.input_dto.car_year,
            city=self.input_dto.city,
            club=self.input_dto.club,
            company=self.input_dto.company,
            district=self.input_dto.district,
            governorate=self.input_dto.governorate,
            guarantor_job=self.input_dto.guarantor_job,
            guarantor_relationship=self.input_dto.guarantor_relationship,
            house_type=self.input_dto.house_type,
            job_name=self.input_dto.job_name,
            marital_status=self.input_dto.marital_status,
            salary=self.input_dto.salary,
            single_payment_day=self.input_dto.single_payment_day,
            classification=self.input_dto.classification,
            national_id_address=self.input_dto.national_id_address,
            home_phone_number=self.input_dto.home_phone_number,
            company_address=self.input_dto.company_address,
            work_phone_number=self.input_dto.work_phone_number,
            additional_salary_source=self.input_dto.additional_salary_source,
        )

        consumer = self.repo.save_consumer(consumer)
        if consumer is None:
            logger.error("Unable to update a consumer")
            return None

        return UpdateConsumerOutputDto(consumer=consumer)
