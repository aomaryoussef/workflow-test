from typing import List
from sqlalchemy.orm import Session
from src.models.lookup import Lookup
from src.repositories.lookup_repository import LookupRepository
from src.services.base_repository_service import BaseRepositoryService


class LookupService(BaseRepositoryService):
    lookup_repository: LookupRepository

    def __init__(self, session: Session = None):
        super().__init__(session, [LookupRepository])

    def get_by_lookup_type(self, lookup_type: str) -> List[Lookup]:
        """
        Get lookup data by lookup type

        Args:
            lookup_type: Lookup type

        Returns:
            List[Lookup]: List of lookup data
        """
        return self.lookup_repository.get_by_lookup_type(lookup_type)
