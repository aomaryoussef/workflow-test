""" This module contains the interface for the BankAccountRepository
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from src.domain.partner.models.bank_account import BankAccount, BankName


class BankAccountRepositoryInterface(ABC):
    """This class is the interface for the BankAccountRepository"""

    @abstractmethod
    def get(self, id: UUID = None) -> Optional[BankAccount]:
        """Get BankAccount by id

        :param id: Optional[UUID]
        :return: Optional[BankAccount]
        """

    @abstractmethod
    def get_by_partner_id(self, partner_id: UUID = None) -> Optional[BankAccount]:
        """Get BankAccount by partner id

        :param partner_id: UUID
        :return: Optional[BankAccount]
        """

    @abstractmethod
    def get_all(self) -> List[BankAccount]:
        """list all BankAccounts
        :return: List[BankAccount]
        """

    @abstractmethod
    def create(
        self,
        partner_id: UUID,
        bank_name: BankName,
        branch_name: str,
        beneficiary_name: str,
        iban: str,
        swift_code: str,
        account_number: str,
    ) -> Optional[BankAccount]:
        """Create a BankAccount

        :return: BankAccount
        """

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Delete a BankAccount

        :return: bool
        """
