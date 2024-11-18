from pydantic import BaseModel
from datetime import datetime


class ApplicationStatus(BaseModel):
    start_time: datetime
    current_time: datetime
    uptime: str
    connectors: dict
