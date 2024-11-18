import uuid

from src.middlewares.tracing import get_trace_id
from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, String, TIMESTAMP, text, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class RequestScenarioType(PyEnum):
    SCORING = 'SCORING'
    VERIFIED_SCORE = 'VERIFIED_SCORE'
    VERIFIED_SCORE_INCOME = 'VERIFIED_SCORE_INCOME'


class Request(BaseModel):
    __tablename__ = 'requests'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    consumer_id = Column(UUID(as_uuid=True), nullable=False)
    scenario = Column(Enum(RequestScenarioType), nullable=False)
    input_data = Column(JSON, nullable=False)
    trace_id = Column(String(50), nullable=False, default=get_trace_id)
    booking_time = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
