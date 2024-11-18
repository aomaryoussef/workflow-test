""" This module contains the interface for the CheckoutBasketRepository
"""

from abc import ABC, abstractmethod
from typing import Optional, List, Dict
from uuid import UUID

from src.domain.checkout.models.checkout_basket import CheckoutBasket, CheckoutBasketStatus


class CheckoutBasketRepositoryInterface(ABC):
    """This class is the interface for the CheckoutBasketRepository"""

    @abstractmethod
    def find_by_session_basket_id(self, session_basket_id: UUID) -> Optional[CheckoutBasket]:
        """
        find checkout basket by session_basket_id
        """

    @abstractmethod
    def save_checkout_basket(self, CheckoutBasket) -> Optional[CheckoutBasket]:
        """
        save checkout basket
        """

    def find_by_workflow_id(self, workflow_id: UUID) -> Optional[CheckoutBasket]:
        """Find checkout basket by workflow_id
        :return: CheckoutBasket"""

    def find_by_loan_id(self, loan_id: UUID) -> Optional[CheckoutBasket]:
        """Find checkout basket by loan_id
        :return: CheckoutBasket"""

    def get_commercial_offers(
        self, session_basket_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[List[Dict[str, any]]]:
        """Get commercial offers for a checkout basket by session basket id
        :return: CheckoutBasket
        :param session_basket_id: UUID
        :return: List[CommercialOffer]
        """

    def find_by_cashier_id(
        self, cashier_id: UUID, checkout_basket_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[List[CheckoutBasket]]:
        """find checkout basket by status and cashier id
        :return: CheckoutBasket
        :param cashier_id: UUID
        :param statuses: [CheckoutBasketStatus]
        """

    def find_by_consumer_id(
        self, consumer_id: UUID, checkout_basket_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[List[CheckoutBasket]]:
        """find checkout basket by status and consumer id
        :return: CheckoutBasket
        :param consumer_id: UUID
        :param statuses: [CheckoutBasketStatus]
        """

    def find_by_consumer_id_and_status(
        self, consumer_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> Optional[CheckoutBasket]:
        """find checkout basket by consumer id and checkout status
        :return: Optional[CheckoutBasket]
        :param consumer_id: UUID
        :param statuses: [CheckoutBasketStatus]
        """

    @abstractmethod
    def get_checkout_baskets(self, partner_id: UUID, limit: int, page_number: int) -> List[CheckoutBasket]:
        """get checkout baskets for partner

        Args:
            partner_id (UUID): _description_
            limit (int): _description_
            page_number (int): _description_

        Returns:
            List[CheckoutBasket]: _description_
        """

    def get_checkout_baskets_count(self, partner_id: UUID, statuses: [CheckoutBasketStatus]) -> int:
        """_summary_

        Args:
            partner_id (UUID): _description_

        Returns:
            int: _description_
        """

    def find_all_for_partner_by_statuses(
        self, partner_id: UUID, statuses: [CheckoutBasketStatus], limit: int, page_number: int
    ) -> List[CheckoutBasket]:
        """find checkout baskets by statuses
        :return: List[CheckoutBasket]
        :param partner_id: UUID
        :param statuses: [CheckoutBasketStatus]
        """

    def find_all_for_consumer_by_statuses(
        self, consumer_id: UUID, statuses: [CheckoutBasketStatus]
    ) -> List[CheckoutBasket]:
        """find checkout baskets by statuses
        :return: List[CheckoutBasket]
        :param consumer_id: UUID
        :param statuses: [CheckoutBasketStatus]
        """
