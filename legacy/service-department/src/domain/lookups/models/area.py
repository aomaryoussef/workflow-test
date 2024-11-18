""" This module has the definition of the Branch entity
"""

from dataclasses import asdict, dataclass

from src.utils.dict_factory import asdict_factory


@dataclass
class Area:
    """Definition of the Area entity"""
    id: int
    mc_id: int
    name_ar: str
    name_en: str
    city_id: int
    governorate_id: int

    def __init__(self, id: int, mc_id: int, name_ar: str, name_en: str, city_id: int, governorate_id: int):
        self.id = id
        self.mc_id = mc_id
        self.name_ar = name_ar
        self.name_en = name_en
        self.city_id = city_id
        self.governorate_id = governorate_id

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
