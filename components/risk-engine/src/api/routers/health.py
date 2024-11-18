from src.config.logging import logger
from fastapi import APIRouter
from datetime import datetime

from src import start_time
from src.config.postgresql import is_db_alive
from src.schemas.status import ApplicationStatus

logger = logger.bind(service="health", context="api", action="check health")

router = APIRouter(
    prefix="",
    tags=["health"]
)


@router.get("/health")
def health_check():  # pragma: no cover
    return None


@router.get("/status", response_model=ApplicationStatus)
def health_check():  # pragma: no cover
    current_time = datetime.now()
    uptime = current_time - start_time
    connectors = {
        "postgresql": "alive" if is_db_alive() else "down",
    }

    res = ApplicationStatus(
        start_time=start_time,
        current_time=current_time,
        uptime=str(uptime),
        connectors=connectors
    )
    return res
