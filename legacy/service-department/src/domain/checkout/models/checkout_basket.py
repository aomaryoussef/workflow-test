from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from uuid import UUID
from enum import Enum
from typing import List, Optional, Dict
from src.utils.dict_factory import asdict_factory
from src.utils.exceptions import ConflictException
import random

class CheckoutBasketCancelStatues(Enum):
    CANCELLED_BY_CASHIER = "CANCELLED_BY_CASHIER"
    CANCELLED_BY_CONSUMER = "CANCELLED_BY_CONSUMER"


class CheckoutBasketStatus(Enum):
    CREATED = "CREATED"
    COMMERCIAL_OFFERS_GENERATED = "COMMERCIAL_OFFERS_GENERATED"
    RISK_CHECK_FAILED = "RISK_CHECK_FAILED"
    COMMERCIAL_OFFERS_FAILURE = "COMMERCIAL_OFFERS_FAILURE"
    LOAN_ACTIVATED = "LOAN_ACTIVATED"
    LOAN_ACTIVATION_FAILURE = "LOAN_ACTIVATION_FAILURE"
    CREDIT_LIMIT_UPDATE_FAILURE = "CREDIT_LIMIT_UPDATE_FAILURE"
    COMMERCIAL_OFFER_SELECTED = "COMMERCIAL_OFFER_SELECTED"
    DOWN_PAYMENT_ACCEPTED = "DOWN_PAYMENT_ACCEPTED"
    IN_ACTIVE_CONSUMER_FAILURE = "IN_ACTIVE_CONSUMER_FAILURE"
    IN_ACTIVE_PARTNER_FAILURE = "IN_ACTIVE_PARTNER_FAILURE"
    IN_PROGRESS_CHECKOUT_FOUND_FAILURE = "IN_PROGRESS_CHECKOUT_FOUND_FAILURE"
    NO_GENERATED_COMMERCIAL_OFFERS_FAILURE = "NO_GENERATED_COMMERCIAL_OFFERS_FAILURE"
    NO_COMMERCIAL_OFFER_SELECTED_FAILURE = "NO_COMMERCIAL_OFFER_SELECTED_FAILURE"
    OTP_FAILURE = "OTP_FAILURE"
    FAILURE = "FAILURE"
    CANCELLED_BY_CASHIER = CheckoutBasketCancelStatues.CANCELLED_BY_CASHIER.value
    CANCELLED_BY_CONSUMER = CheckoutBasketCancelStatues.CANCELLED_BY_CONSUMER.value


@dataclass
class CheckoutBasket:
    id: Optional[UUID] = None
    workflow_id: Optional[UUID] = None
    partner_id: Optional[UUID] = None
    cashier_id: Optional[UUID] = None
    branch_id: Optional[UUID] = None
    consumer_id: Optional[UUID] = None
    session_basket_id: Optional[UUID] = None
    selected_commercial_offer_id: Optional[UUID] = None
    status: Optional[CheckoutBasketStatus] = None
    products: Optional[List[Dict[str, any]]] = None
    commercial_offers: Optional[List[Dict[str, any]]] = None
    consumer_device_metadata: Optional[Dict[str, any]] = None
    gross_basket_value: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    loan_id: Optional[UUID] = None
    category: Optional[str] = None
    transaction_id: Optional[int] = None
    origination_channel: Optional[str] = None

    def find_commercial_offer_by_id(self, commercial_offer_id: str):
        for offer in self.commercial_offers:
            if offer["id"] == commercial_offer_id:
                return offer

    def get_booking_time(self):
        return self.created_at.isoformat("T") + "Z"

    def get_booking_time_utc(self):
        created_at_utc = self.created_at.astimezone(timezone.utc)
        return created_at_utc.isoformat("T")

    def cancel(self, status: CheckoutBasketCancelStatues):
        disallow_cancel_statuses = [
            CheckoutBasketStatus.CANCELLED_BY_CASHIER,
            CheckoutBasketStatus.CANCELLED_BY_CONSUMER,
            CheckoutBasketStatus.LOAN_ACTIVATED,
            CheckoutBasketStatus.DOWN_PAYMENT_ACCEPTED,
            CheckoutBasketStatus.COMMERCIAL_OFFERS_FAILURE,
            CheckoutBasketStatus.RISK_CHECK_FAILED,
            CheckoutBasketStatus.LOAN_ACTIVATION_FAILURE,
            CheckoutBasketStatus.CREDIT_LIMIT_UPDATE_FAILURE,
            CheckoutBasketStatus.OTP_FAILURE,
            CheckoutBasketStatus.IN_ACTIVE_CONSUMER_FAILURE,
            CheckoutBasketStatus.IN_PROGRESS_CHECKOUT_FOUND_FAILURE,
            CheckoutBasketStatus.NO_GENERATED_COMMERCIAL_OFFERS_FAILURE,
        ]

        if self.status in disallow_cancel_statuses:
            raise ConflictException(self.status.value)

        self.status = status

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result

    def update_status(self, status: CheckoutBasketStatus):
        disallowed_statuses_update = [
            CheckoutBasketStatus.CANCELLED_BY_CASHIER,
            CheckoutBasketStatus.CANCELLED_BY_CONSUMER,
        ]
        if self.status not in disallowed_statuses_update:
            self.status = status

    def update_loan_id(self, loan_id: UUID):
        self.loan_id = loan_id

    @staticmethod
    def generate_transaction_id():
        num_digits = 16
        lower_bound = 10**(num_digits - 1)
        upper_bound = 10**num_digits - 1
        unique_number = random.randint(lower_bound, upper_bound)
        return unique_number    
