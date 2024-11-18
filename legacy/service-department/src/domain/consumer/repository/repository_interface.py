from abc import ABC, abstractmethod
from typing import Optional
from src.domain.consumer.models.consumer import Consumer
from src.domain.consumer.models.credit_limit import CreditLimit, CreditLimitDirection


class ConsumerRepositoryInterface(ABC):
    @abstractmethod
    def get_by_phone_number(self, phone_number: str) -> Optional[Consumer]:
        """
        get consumer by phone number
        """

    @abstractmethod
    def create_consumer_credit_limit(self, consumer_id, credit_limit) -> Optional[CreditLimit]:
        """
        create consumer credit limit
        """

    @abstractmethod
    def activate_consumer(self, consumer_id, credit_officer_iam_id, branch_name) -> Optional[Consumer]:
        """
        activate consumer
        """

    @abstractmethod
    def update_status(self, consumer_id, status) -> Optional[Consumer]:
        """
        change consumer to awaiting activation
        """

    @abstractmethod
    def get_available_credit_limit(self, consumer_id) -> Optional[CreditLimit]:
        """
        get available credit limit
        """

    def get_by_iam_id(self, iam_id: str) -> Optional[Consumer]:
        """
        get consumer by iam id
        """

    @abstractmethod
    def create_consumer(self, Consumer) -> Optional[Consumer]:
        """
        create consumer
        """

    @abstractmethod
    def get(self, id: str) -> Optional[Consumer]:
        """
        find consumer
        """

    @abstractmethod
    def delete(self, consumer: Consumer) -> Optional[Consumer]:
        """
        delete consumer
        """

    @abstractmethod
    def save_consumer(self, consumer: Consumer) -> Optional[Consumer]:
        """
        save consumer
        """

    @abstractmethod
    def phone_number_exists_in_beta(self, phone_number: str) -> bool:
        """
        Check if the phone number exists in BetaConsumerDBModel
        """
    def update_credit_limit(self, consumer_id, amount: int, direction: CreditLimitDirection) -> Optional[CreditLimit]:
        """
        Update consumer credit limit based on direction (INCREASE or DECREASE)
        """
