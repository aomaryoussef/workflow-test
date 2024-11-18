import datetime
from enum import Enum
from uuid import UUID
from ulid import ULID
from src.domain.partner.models.branch import Coordinates


def asdict_factory(data):
    def convert_value(obj):
        if isinstance(obj, (datetime.datetime, UUID)):
            return str(obj)
        elif isinstance(obj, Enum):
            return obj.value
        elif isinstance(obj, list) and len(obj) > 0 and isinstance(obj[0], Enum):
            return [item.value for item in obj]
        elif isinstance(obj, ULID):
            return str(obj)
        elif isinstance(obj, Coordinates):
            return {"latitude": obj.latitude, "longitude": obj.longitude}
        return obj

    return dict((k, convert_value(v)) for k, v in data)
