from src.config.logging import logger
from src.api.routes import app
from fastapi import Request
from src.config.postgresql import SessionLocal

logger = logger.bind(service="middlewares", context="database", action="database")


@app.middleware("http")
async def db_session_middleware(request: Request, call_next):
    request.state.db = SessionLocal()
    response = None
    try:
        response = await call_next(request)
        request.state.db.commit()
    except Exception as e:
        request.state.db.rollback()
        raise e
    finally:
        # Check if there's an uncommitted transaction before closing
        if request.state.db.is_active:
            request.state.db.rollback()
        request.state.db.close()
    return response
