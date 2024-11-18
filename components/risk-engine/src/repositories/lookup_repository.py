from src.config.logging import logger
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from src.models.lookup import Lookup

logger = logger.bind(service="lookup", context="repository", action="lookup")


class LookupRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, lookup_id: UUID) -> Optional[Lookup]:
        """
        Retrieve a lookup by its UUID.

        Args:
            lookup_id (UUID): The UUID of the lookup.

        Returns:
            Lookup or None: The lookup if found, None otherwise
        """
        try:
            lookup = self.session.query(Lookup).filter(Lookup.id == lookup_id).first()
            if lookup is None:
                logger.debug(f"lookup with id {lookup_id} not found")
                return None
            return lookup
        except Exception as err:
            logger.error(f"error fetching lookup by id", lookup_id=lookup_id, error=err)
            return None

    def get_by_lookup_type(self, lookup_type: str) -> List[Lookup]:
        """
        Retrieve all lookups by type.

        Args:
            lookup_type (str): The type of the lookup.

        Returns:
            List[Lookup]: A list of all lookups of the specified type.
        """
        try:
            lookups = self.session.query(Lookup).filter(Lookup.lookup_type == lookup_type).all()
            logger.debug(f"fetched {len(lookups)} lookups of type '{lookup_type}'")
            return lookups
        except Exception as err:
            logger.error(f"error fetching lookups by type '{lookup_type}'", error=err)
            return []
