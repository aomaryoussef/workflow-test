import uuid
from src.models import BaseModel
from enum import Enum as PyEnum
from sqlalchemy import Column, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import Enum


class LookupType(PyEnum):
    job_name_map = "job_name_map"
    job_type = "job_type"
    mobile_os_type = "mobile_os_type"
    house_type = "house_type"
    marital_status = "marital_status"
    scenario = "scenario"


class Lookup(BaseModel):
    __tablename__ = 'lookups'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lookup_type = Column(Enum(LookupType), nullable=False)
    slug = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
