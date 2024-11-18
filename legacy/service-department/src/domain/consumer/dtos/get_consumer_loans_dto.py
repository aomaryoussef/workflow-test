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
class LoanInstallment:
    instalment_due_date: datetime
    paid_date: datetime
    grace_period_end_date: datetime
    principal_due: Money
    interest_due: Money
    late_fee_due: Money
    paid_principal: Money
    paid_interest: Money
    paid_late_fee: Money
    installment_id: int
    is_cancelled: bool


@dataclass()
class Loan:
    loan_id: uuid
    partner_id: str
    partner_name: str
    admin_fee: Money
    current_status: LoanStatus
    booked_at: datetime
    payment_schedule: List[LoanInstallment]
    early_settlement_details: dict

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)


@dataclass
class GetConsumerLoansOutputDto:
    loans: List[Loan]
    consumer_id: uuid

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)
