""" This module contains the interface for the BranchRepository
"""

from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from src.domain.partner.models.branch import Branch, Coordinates


class BranchRepositoryInterface(ABC):
    """This class is the interface for the BranchRepository"""

    @abstractmethod
    def get(self, id: UUID = None) -> Optional[Branch]:
        """Get Branch by id

        :param id: Optional[UUID]
        :return: Optional[Branch]
        """

    @abstractmethod
    def get_all(self) -> List[Branch]:
        """list all branches
        :return: List[Branch]
        """

    @abstractmethod
    def create(
        self,
        partner_id: UUID,
        governorate_id: int,
        city_id: int,
        street: str,
        location: Coordinates,
        google_maps_link: str,
        area_id: Optional[int],
        area: Optional[str],
    ) -> Optional[Branch]:
        """Create a Branch

        :return: Branch
        """

    @abstractmethod
    def delete(self, id: UUID) -> bool:
        """Delete a Branch

        :return: bool
        """
