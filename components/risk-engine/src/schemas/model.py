from enum import Enum
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Extra
from datetime import datetime


class ModelType(str, Enum):
    ML = 'ML'
    RULE_BASED = 'RULE_BASED'
    CALCULATIONS = 'CALCULATIONS'
    PRE_PROCESSING = 'PRE_PROCESSING'


class ModelBase(BaseModel):
    name: str
    type: ModelType
    is_active: bool
    version: int
    features_names: Optional[dict] = None
    features_dtypes: Optional[dict] = None
    parameters: Optional[dict] = None


class ModelUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[ModelType] = None
    is_active: Optional[bool] = None
    version: Optional[int] = None
    features_names: Optional[dict] = None
    features_dtypes: Optional[dict] = None
    parameters: Optional[dict] = None

    class Config:
        use_enum_values = True  # This allows using enum values instead of enum names in JSON
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "name": "PDModel",
                "type": "ML",
                "version": 7,
                "parameters": {"GREEN_INCOME_ZONE_THRESHOLD": 0.1, "RED_INCOME_ZONE_THRESHOLD": 0.5},
                "is_active": True,
            }
        }


class ModelCreate(ModelBase):
    pass

    class Config:
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "name": "PDModel",
                "type": "ML",
                "version": 7,
                "parameters": {"GREEN_INCOME_ZONE_THRESHOLD": 0.1, "RED_INCOME_ZONE_THRESHOLD": 0.5},
                "is_active": True,
            }
        }


class ModelRead(ModelBase):
    id: UUID
    created_at: datetime

    class Config:
        use_enum_values = True  # This allows using enum values instead of enum names in JSON
        from_attributes = True
