from dataclasses import asdict, dataclass
from uuid import UUID


@dataclass
class CreateCommercialOffersInputDto:
    offer_details: list[dict[str, any]]
    workflow_id: UUID

    def __init__(self, offer_details: list[dict[str, any]], workflow_id: UUID):
        self.offer_details = offer_details
        self.workflow_id = workflow_id

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)
