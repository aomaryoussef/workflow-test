from dataclasses import asdict, dataclass
from datetime import datetime
from uuid import UUID
from enum import Enum
from typing import Optional
from src.utils.dict_factory import asdict_factory
from src.domain.consumer.models.credit_limit import CreditLimit


class ConsumerStatus(Enum):
    AWAITING_ACTIVATION = "AWAITING_ACTIVATION"
    ACTIVE = "ACTIVE"
    BLOCKED = "BLOCKED"
    WAITING_LIST = "WAITING_LIST"


@dataclass
class Consumer:
    id: Optional[UUID] = None
    iam_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    national_id: Optional[str] = None
    address: Optional[str] = None
    credit_limit: Optional[CreditLimit] = None
    status: ConsumerStatus = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    full_name: Optional[str] = None
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
    origination_channel: Optional[str] = None
    classification: Optional[str] = None
    activated_at: Optional[datetime] = None
    national_id_address: Optional[str] = None
    home_phone_number: Optional[str] = None
    company_address: Optional[str] = None
    work_phone_number: Optional[str] = None
    additional_salary_source: Optional[str] = None
    activated_by_iam_id: Optional[str] = None
    activation_branch: Optional[str] = None

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
