import json
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import declared_attr
from datetime import datetime, date
from uuid import UUID
from enum import Enum
from sqlalchemy.types import JSON
from config.settings import settings

from src.utils.data_helpers import CustomJSONEncoder

schema = settings.get("database", default={}).get("schema", default="_services")

Base = declarative_base()


class BaseModel(Base):
    __abstract__ = True
    __table_args__ = {'schema': schema}

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    def to_dict(self):
        """
        Convert SQLAlchemy model instance to dictionary.

        Handles various data types including datetime, date, UUID, Enum, and JSON.
        """

        def convert_value(value):
            if isinstance(value, datetime):
                return value.isoformat()
            elif isinstance(value, date):
                return value.isoformat()
            elif isinstance(value, UUID):
                return str(value)
            elif isinstance(value, Enum):
                return value.value
            elif isinstance(value, JSON):
                return json.dumps(value, cls=CustomJSONEncoder)
            return value

        return {column.name: convert_value(getattr(self, column.name)) for column in self.__table__.columns}

    @classmethod
    def from_dict(cls, data):
        """
        Create an instance of Request from a dictionary.

        Args:
            data (dict): A dictionary containing the fields and values.

        Returns:
            Request: An instance of Request.
        """
        return cls(**data)
