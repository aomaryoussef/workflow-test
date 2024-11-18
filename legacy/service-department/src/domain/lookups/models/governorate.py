""" This module has the definition of the Branch entity
"""

from dataclasses import asdict, dataclass

from src.utils.dict_factory import asdict_factory


@dataclass
class Governorate:
    """Definition of the Governorate entity"""
    id: int
    mc_id: int
    name_ar: str
    name_en: str

    def __init__(self, id: int, mc_id: int, name_ar: str, name_en: str):
        self.id = id
        self.mc_id = mc_id
        self.name_ar = name_ar
        self.name_en = name_en

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
