""" This module contains the interface for the AreaRepository """

from abc import ABC, abstractmethod
from typing import Optional, List

from src.domain.lookups.models.area import Area


class AreaRepositoryInterface(ABC):
    """This class is the interface for the AreaRepository"""

    @abstractmethod
    def get(self, id: int) -> Optional[Area]:
        """Get Area by id

        :param id: int
        :return: Optional[Area]
        """

    @abstractmethod
    def get_all(self) -> List[Area]:
        """List all areas

        :return: List[Area]
        """
