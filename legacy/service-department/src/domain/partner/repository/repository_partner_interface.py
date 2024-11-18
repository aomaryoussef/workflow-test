""" This module contains the interface for the PartnerRepository
"""

from types import FunctionType
from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from src.domain.partner.models.partner import Partner


class PartnerRepositoryInterface(ABC):
    """This class is the interface for the PartnerRepository"""

    @abstractmethod
    def find_one(self, id: Optional[UUID] = None, name: Optional[str] = None) -> Optional[Partner]:
        """Find Partner

        :param id: Optional[UUID]
        :param name: Optional[str]
        :return: Optional[Partner]
        """

    @abstractmethod
    def find_by(self, column_name: str, column_value) -> Optional[Partner]:
        """Find Partner by column

        :param column_name: str
        :param column_value
        :return: Optional[Partner]
        """

    @abstractmethod
    def find_all(self) -> List[Partner]:
        """list all partners
        :return: List[Partner]
        """

    @abstractmethod
    def create(
        self, name: str, categories: list[str], tax_registration_number: str, commercial_registration_number: str
    ) -> Optional[Partner]:
        """Create a Partner

        :return: Partner
        """

    @abstractmethod
    def create_complete_partner(self, partner: Partner, callback: Optional[FunctionType] = None) -> Optional[Partner]:
        """Create a Partner

        :return: Partner
        """

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Delete a Partner by id

        :return: bool
        """

    @abstractmethod
    def get_names_by_ids(self, ids: List[UUID]) -> List[str]:
        """Get partner names by ids

        :return: bool
        """
