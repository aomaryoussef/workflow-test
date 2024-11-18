from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Extra, conint


class IScoreStatusType(Enum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    NO_OUTPUT = 'NO_OUTPUT'  # success but no output


# this is used for application input
class IScoreApplicationDataInput(BaseModel):
    iscore_score: conint(ge=0)
    iscore_report: str  # either it's malformed, or dict or list

    class Config:
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "iscore_score": 693.0,
                "iscore_report": None
            }
        }


class IScoreCreate(BaseModel):
    consumer_id: UUID
    consumer_ssn: str
    iscore_id: Optional[UUID] = None
    request_id: UUID
    iscore_score: Optional[conint(ge=0)] = None
    iscore_report: Optional[str] = None  # either it's malformed, or dict or list
    raw_response: Optional[str] = None
    status: Optional[IScoreStatusType] = None
    booking_time: datetime

    class Config:
        use_enum_values = True  # This allows using enum values instead of enum names in JSON
        extra = Extra.forbid  # This forbids extra fields


class IScoreRawResponseCreate(BaseModel):
    request_id: UUID
    iscore_report: Optional[str] = None  # either it's malformed, or dict or list
    raw_response: Optional[str] = None
    booking_time: datetime

    class Config:
        extra = Extra.forbid  # This forbids extra fields
