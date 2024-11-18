""" This module contains the interface for the CityRepository """

from abc import ABC, abstractmethod
from typing import Optional, List

from src.domain.lookups.models.city import City


class CityRepositoryInterface(ABC):
    """This class is the interface for the CityRepository"""

    @abstractmethod
    def get(self, id: int) -> Optional[City]:
        """Get City by id

        :param id: int
        :return: Optional[City]
        """

    @abstractmethod
    def get_all(self) -> List[City]:
        """List all cities

        :return: List[City]
        """
