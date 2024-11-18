import uuid

from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, TIMESTAMP, text, JSON, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class ModelType(PyEnum):
    ML = 'ML'
    RULE_BASED = 'RULE_BASED'
    CALCULATIONS = 'CALCULATIONS'
    PRE_PROCESSING = 'PRE_PROCESSING'


class Model(BaseModel):
    __tablename__ = 'models'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type = Column(Enum(ModelType), nullable=False)
    version = Column(Integer, nullable=False)
    features_names = Column(JSON, nullable=True)  # list
    features_dtypes = Column(JSON, nullable=True)  # dict
    parameters = Column(JSON, nullable=True)  # dict
    is_active = Column(Boolean, nullable=False, default=False)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
