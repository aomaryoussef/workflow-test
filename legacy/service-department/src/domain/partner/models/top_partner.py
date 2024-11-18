""" This module has the definition of the TopPartner entity
"""

from dataclasses import asdict, dataclass
from datetime import datetime
from uuid import UUID, uuid4
from src.domain.partner.models.partner import Partner
from src.utils.dict_factory import asdict_factory


@dataclass
class TopPartner:
    """Definition of the TopPartner entity"""

    id: UUID
    partner_id: UUID
    created_at: datetime
    updated_at: datetime
    partner: Partner

    def __init__(
        self,
        partner_id: UUID
    ):
        self.id = uuid4()
        self.partner_id = partner_id
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
