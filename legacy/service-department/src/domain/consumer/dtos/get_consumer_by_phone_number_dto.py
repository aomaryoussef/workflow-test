from dataclasses import dataclass
from src.domain.consumer.models.consumer import Consumer


@dataclass
class GetConsumerByPhoneNumberOutputDto:
    consumer: Consumer

    def __init__(self, consumer: Consumer):
        self.consumer = consumer

    def to_dict(self):
        return {
            "id": str(self.consumer.id),
            "iam_id": str(self.consumer.iam_id),
            "first_name": self.consumer.first_name,
            "last_name": self.consumer.last_name,
            "phone_number": self.consumer.phone_number,
            "national_id": self.consumer.national_id,
            "address": self.consumer.address,
            "credit_limit": 0 if self.consumer.credit_limit is None else self.consumer.credit_limit.value,
            "status": self.consumer.status.value,
            "created_at": str(self.consumer.created_at),
            "updated_at": str(self.consumer.updated_at),
            "activated_at": str(self.consumer.activated_at),
            "activated_by_iam_id": self.consumer.activated_by_iam_id,
            "activation_branch": self.consumer.activation_branch,
            "full_name": self.consumer.full_name,
            "job_name": self.consumer.job_name,
            "work_type": self.consumer.work_type,
            "club": self.consumer.club,
            "house_type": self.consumer.house_type,
            "city": self.consumer.city,
            "district": self.consumer.district,
            "governorate": self.consumer.governorate,
            "salary": 0 if self.consumer.salary is None else int(self.consumer.salary),
            "additional_salary": 0 if self.consumer.additional_salary is None else int(self.consumer.additional_salary),
            "address_description": self.consumer.address_description,
            "guarantor_job": self.consumer.guarantor_job,
            "guarantor_relationship": self.consumer.guarantor_relationship,
            "car_year": self.consumer.car_year,
            "marital_status": self.consumer.marital_status,
            "company": self.consumer.company,
            "single_payment_day": self.consumer.single_payment_day,
            "origination_channel": self.consumer.origination_channel,
            "classification": self.consumer.classification,
            "national_id_address": self.consumer.national_id_address,
            "home_phone_number": self.consumer.home_phone_number,
            "company_address": self.consumer.company_address,
            "work_phone_number": self.consumer.work_phone_number,
            "additional_salary_source": self.consumer.additional_salary_source,
        }
