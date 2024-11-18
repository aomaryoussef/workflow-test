from dataclasses import asdict, dataclass
from typing import Optional

from src.domain.consumer.models.consumer import Consumer


@dataclass(frozen=True)
class UpdateConsumerInputDto:
    id: Optional[str] = None
    full_name: Optional[str] = None
    national_id: Optional[str] = None
    address: Optional[str] = None
    job_name: Optional[str] = None
    work_type: Optional[str] = None
    club: Optional[str] = None
    house_type: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    governorate: Optional[str] = None
    salary: Optional[float] = None
    additional_salary: Optional[float] = None
    address_description: Optional[str] = None
    guarantor_job: Optional[str] = None
    guarantor_relationship: Optional[str] = None
    car_year: Optional[int] = None
    marital_status: Optional[str] = None
    company: Optional[str] = None
    single_payment_day: Optional[int] = None
    national_id_address: Optional[str] = None
    home_phone_number: Optional[str] = None
    company_address: Optional[str] = None
    work_phone_number: Optional[str] = None
    additional_salary_source: Optional[str] = None
    classification: Optional[str] = None

    def to_dict(self):
        return asdict(self)


@dataclass
class UpdateConsumerOutputDto:
    consumer: Consumer

    def to_dict(self):
        consumer_dict = self.consumer.to_dict()
        consumer_dict["credit_limit"] = self.consumer.credit_limit
        return consumer_dict
