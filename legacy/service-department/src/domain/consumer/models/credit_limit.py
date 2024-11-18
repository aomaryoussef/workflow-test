from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
from uuid import UUID
from typing import Optional
from src.utils.dict_factory import asdict_factory


@dataclass
class CreditLimit:
    id: Optional[UUID] = None
    consumer_id: Optional[UUID] = None
    value: Optional[int] = None
    created_at: Optional[datetime] = None

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result


class CreditLimitDirection(Enum):
    INCREASE = "INCREASE"
    DECREASE = "DECREASE"
