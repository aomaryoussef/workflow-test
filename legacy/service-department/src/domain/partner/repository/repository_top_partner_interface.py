""" This module contains the interface for the PartnerRepository
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from src.domain.partner.models.top_partner import TopPartner


class TopPartnerRepositoryInterface(ABC):
    """This class is the interface for the TopPartnerRepository"""

    @abstractmethod
    def get(self, id: UUID = None) -> TopPartner:
        """Get Top Partner by id

        :param id: Optional[UUID]
        :return: Optional[List[Partner]]
        """

    @abstractmethod
    def get_all(self) -> List[TopPartner]:
        """list all top partners
        :return: List[TopPartner]
        """

    @abstractmethod
    def create(
        self, partnerId: UUID
    ) -> Optional[TopPartner]:
        """Create a Top Partner

        :return: TopPartner
        """

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Delete a Top Partner by id

        :return: bool
        """
