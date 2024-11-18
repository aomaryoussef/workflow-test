import uuid

from src.middlewares.tracing import get_trace_id
from src.models import BaseModel
from sqlalchemy import Column, Integer, String, TIMESTAMP, text, Float
from sqlalchemy.dialects.postgresql import UUID


class ScoringOutput(BaseModel):
    __tablename__ = 'scoring_output'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    consumer_ssn = Column(String(14), nullable=False)
    consumer_id = Column(UUID(as_uuid=True), nullable=False)
    runs_id = Column(UUID(as_uuid=True), nullable=False)
    request_id = Column(UUID(as_uuid=True), nullable=False)
    ar_status = Column(String(20), nullable=True)
    calc_credit_limit = Column(Integer, nullable=True)
    pd_predictions = Column(Float, nullable=True)
    income_predictions = Column(Integer, nullable=True)
    income_zone = Column(String(50), nullable=True)
    final_net_income = Column(Integer, nullable=True)
    cwf_segment = Column(String(20), nullable=True)
    cwf = Column(Float, nullable=True)
    trace_id = Column(String(50), nullable=False, default=get_trace_id)
    booking_time = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=text('CURRENT_TIMESTAMP'), nullable=False)
