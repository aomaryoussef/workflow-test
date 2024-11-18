from typing import Optional
from ulid import ULID
from datetime import datetime
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.registry.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.registry.models.payment import PaymentChannel, PayeeType, PayeeIdType, Payment


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    id: Optional[ULID]
    channel: PaymentChannel
    channel_reference_id: str
    channel_transaction_id: str
    payee_id: str
    payee_type: PayeeType
    payee_id_type: PayeeIdType
    billing_account: str
    billing_account_schedule_id: int
    amount_units: int
    booking_time: datetime
    raw_request: dict
    created_by: str


@dataclass
class OutputDto(BaseOutputDto):
    payment: Payment

    def to_dict(self):
        result = asdict(self.payment, dict_factory=asdict_factory)
        return result
