from types import FunctionType
from ulid import ULID
from abc import ABC, abstractmethod
from typing import Optional
from src.domain.registry.models.payment import Payment, PaymentStatus


class PaymentRepoInterface(ABC):
    @abstractmethod
    def create(self, payment: Payment, callback: Optional[FunctionType]) -> Optional[Payment]:
        """Create a payment

        :return: Payment or None
        """

    @abstractmethod
    def find(self, id: ULID) -> Optional[Payment]:
        """Find a payment by id

        :return: Payment or None
        """

    @abstractmethod
    def find_all(
        self, billing_account: Optional[str] = None, billing_account_schedule_id: Optional[int] = None
    ) -> list[Payment]:
        """Find all payments

        :return: [Payment]
        """

    @abstractmethod
    def update(self, id: ULID, status: PaymentStatus) -> Optional[Payment]:
        """Update a payment

        :return: Payment or None
        """

    @abstractmethod
    def delete(self, id: ULID) -> bool:
        """Delete a record by id

        :return: bool
        """
