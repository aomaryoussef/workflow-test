import uuid

from src.middlewares.tracing import get_trace_id
from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, String, TIMESTAMP, text, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class RunStatusType(PyEnum):
    SUCCESS = 'SUCCESS'
    FAILED = 'FAILED'


class Run(BaseModel):
    __tablename__ = 'runs'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    request_id = Column(UUID(as_uuid=True), nullable=False)
    model_id = Column(UUID(as_uuid=True), nullable=False)
    input_data = Column(JSON, nullable=False)
    output_data = Column(JSON, nullable=False)
    execution_duration_ms = Column(Integer, nullable=False)
    status = Column(Enum(RunStatusType), nullable=False)
    trace_id = Column(String(50), nullable=False, default=get_trace_id)
    booking_time = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
