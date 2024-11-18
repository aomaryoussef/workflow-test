""" This module contains the interface for the GovernorateRepository """

from abc import ABC, abstractmethod
from typing import Optional, List

from src.domain.lookups.models.governorate import Governorate


class GovernorateRepositoryInterface(ABC):
    """This class is the interface for the GovernorateRepository"""

    @abstractmethod
    def get(self, id: int) -> Optional[Governorate]:
        """Get Governorate by id

        :param id: int
        :return: Optional[Governorate]
        """

    @abstractmethod
    def get_all(self) -> List[Governorate]:
        """List all governorates

        :return: List[Governorate]
        """
