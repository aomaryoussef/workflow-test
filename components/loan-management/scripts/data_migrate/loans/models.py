from datetime import datetime
from dataclasses import dataclass, field
from typing import List

# Define data classes
@dataclass
class LoanStatus:
    status: str
    created_at: datetime

@dataclass
class Loan:
    id: str
    financial_product_key: str
    financial_product_version: str
    booked_at: datetime
    consumer_id: str
    merchant_global_id: str
    commercial_offer_id: str
    statuses: List[LoanStatus]
    # Will be added later
    tenor_key: str
    consumer_repayment_day_of_month: int
    origination_amount: int
    down_payment_amount: int
    merchant_code: str
