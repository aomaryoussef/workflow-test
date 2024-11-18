""" This module has the definition of the Branch entity
"""

from collections import namedtuple
from dataclasses import asdict, dataclass
from datetime import datetime
from uuid import UUID, uuid4

Coordinates = namedtuple("Coordinates", ["latitude", "longitude"])


@dataclass
class Branch:
    """Definition of the Branch entity"""

    id: UUID
    partner_id: UUID
    name: str
    area: str
    street: str
    governorate_id: int
    area_id: int
    city_id: int
    location: Coordinates
    google_maps_link: str
    created_at: datetime
    updated_at: datetime

    def __init__(
        self,
        partner_id: UUID,
        name: str,
        governorate_id: int,
        city_id: int,
        street: str,
        location: Coordinates,
        google_maps_link: str,
        id: UUID = None,
        area_id: int = None,
        area: str = None,
    ):
        self.id = uuid4() if id is None else id
        self.partner_id = partner_id
        self.name = name
        self.governorate_id = governorate_id
        self.city_id = city_id
        self.area_id = area_id
        self.area = area
        self.street = street
        self.location = location
        self.google_maps_link = google_maps_link
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        result = asdict(self)
        return result