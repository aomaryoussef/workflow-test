from dataclasses import dataclass
from typing import List
from src.domain.partner.models.top_partner import TopPartner


@dataclass
class RetrieveTopPartnersOutputDto:
    data: List[TopPartner]
    total_count: int

    def __init__(self, data: List[TopPartner], total_count: int):
        self.data = data
        self.total_count = total_count

    def to_dict(self):
        return {
            "data": [top_partner.to_dict() for top_partner in self.data],
            "total_count": self.total_count,
        }
