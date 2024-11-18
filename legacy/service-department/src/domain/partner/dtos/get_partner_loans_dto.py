from dataclasses import asdict, dataclass
import datetime
from typing import List
from moneyed import Money
import uuid


@dataclass()
class LoanStatus:
    status_type: str
    created_at: datetime


@dataclass()
class PartnerLoan:
    loan_id: uuid
    correlation_id: uuid
    consumer_id: uuid
    partner_id: uuid
    financial_product_key: str
    financial_product_version: str
    admin_fee: Money
    current_status: LoanStatus
    booked_at: datetime
    created_at: datetime
    created_by: str
    transaction_status: str
    transaction_id: uuid
    payment_status: str

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)


@dataclass
class GetPartnerLoansOutputDto:
    loans: List[PartnerLoan]

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)
