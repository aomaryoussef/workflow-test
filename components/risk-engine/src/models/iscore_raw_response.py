import uuid

from src.middlewares.tracing import get_trace_id
from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, String, TIMESTAMP, text, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class IScoreRawResponse(BaseModel):
    __tablename__ = 'iscore_raw_response'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    iscore_id = Column(UUID(as_uuid=True), nullable=False)
    request_id = Column(UUID(as_uuid=True), nullable=False)
    raw_response = Column(String, nullable=True)
    trace_id = Column(String(50), nullable=False, default=get_trace_id)
    booking_time = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
