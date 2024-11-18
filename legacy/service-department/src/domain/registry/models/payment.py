from __future__ import annotations
from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
from ulid import ULID
from src.utils.dict_factory import asdict_factory


class PaymentStatus(Enum):
    CREATED = "CREATED"
    PROCESSING = "PROCESSING"
    PROCESSED = "PROCESSED"


class PaymentChannel(Enum):
    BTECH_STORE = "BTECH_STORE"
    FAWRY = "FAWRY"


class PayeeType(Enum):
    CONSUMER = "CONSUMER"
    MERCHANT = "MERCHANT"


class PayeeIdType(Enum):
    EMAIL = "EMAIL"
    GLOBAL_UID = "GLOBAL_UID"


class CurrencyCode(Enum):
    EGP = "EGP"


@dataclass
class Payment:
    """Definition of the Payment entity"""

    id: ULID
    status: PaymentStatus
    channel: PaymentChannel
    channel_reference_id: str
    channel_transaction_id: str
    payee_id: str
    payee_type: PayeeType
    payee_id_type: PayeeIdType
    billing_account: str
    billing_account_schedule_id: int
    amount_units: int
    amount_currency: CurrencyCode
    raw_request: dict
    booking_time: datetime
    created_at: datetime
    created_by: str
    updated_at: datetime
    metadata: dict

    def __init__(
        self,
        channel: PaymentChannel,
        channel_reference_id: str,
        channel_transaction_id: str,
        payee_id: str,
        payee_type: PayeeType,
        billing_account: str,
        billing_account_schedule_id: int,
        booking_time: datetime,
        amount_units: int,
        created_by: str = "",
        raw_request: dict = dict(),
        payee_id_type: PayeeIdType = PayeeIdType.GLOBAL_UID,
        id: ULID = ULID(),
        status: PaymentStatus = PaymentStatus.CREATED,
        metadata: dict = dict(),
        amount_currency: CurrencyCode = CurrencyCode.EGP,
        created_at: datetime = datetime.now(),
        updated_at: datetime = datetime.now(),
    ):
        self.id = id
        self.status = status
        self.channel = channel
        self.channel_reference_id = channel_reference_id
        self.channel_transaction_id = channel_transaction_id
        self.payee_id = payee_id
        self.payee_type = payee_type
        self.payee_id_type = payee_id_type
        self.billing_account = billing_account
        self.billing_account_schedule_id = billing_account_schedule_id
        self.amount_units = amount_units
        self.amount_currency = amount_currency
        self.raw_request = raw_request
        self.booking_time = booking_time
        self.created_at = created_at
        self.created_by = created_by
        self.updated_at = updated_at
        self.metadata = metadata

    @property
    def collected_as_early_settlement(self):
        return self.billing_account_schedule_id == -1

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        result["booking_time"] = self.booking_time.isoformat("T") + "Z"
        result["collected_as_early_settlement"] = self.collected_as_early_settlement
        return result

    @staticmethod
    def from_dict(d: dict) -> Payment:
        return Payment(
            id=d["id"],
            status=PaymentStatus[d["status"]],
            channel=d["channel"],
            channel_reference_id=d["channel_reference_id"],
            channel_transaction_id=d["channel_transaction_id"],
            payee_id=d["payee_id"],
            payee_type=d["payee_type"],
            payee_id_type=d["payee_id_type"],
            billing_account=d["billing_account"],
            billing_account_schedule_id=d["billing_account_schedule_id"],
            booking_time=datetime.fromisoformat(d["booking_time"].rstrip("Z")),
            amount_units=d["amount_units"],
            created_at=datetime.fromisoformat(d["created_at"]),
            created_by=d["created_by"],
            updated_at=datetime.fromisoformat(d["updated_at"]),
            raw_request=d["raw_request"],
            metadata=d["metadata"],
            amount_currency=CurrencyCode[d["amount_currency"]],
        )
