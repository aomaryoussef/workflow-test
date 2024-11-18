import uuid

from src.middlewares.tracing import get_trace_id
from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, String, TIMESTAMP, text, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class IScoreStatusType(PyEnum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'
    NO_OUTPUT = 'NO_OUTPUT'  # success but no output


class IScore(BaseModel):
    __tablename__ = 'iscore'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    consumer_id = Column(UUID(as_uuid=True), nullable=False)
    consumer_ssn = Column(String(14), nullable=False)
    iscore_id = Column(UUID(as_uuid=True), nullable=True)
    request_id = Column(UUID(as_uuid=True), nullable=False)
    iscore_score = Column(Integer, nullable=True)
    iscore_report = Column(JSON, nullable=True)
    status = Column(Enum(IScoreStatusType), nullable=False)
    trace_id = Column(String(50), nullable=False, default=get_trace_id)
    booking_time = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
