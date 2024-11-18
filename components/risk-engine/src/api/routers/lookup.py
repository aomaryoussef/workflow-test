from src.config.logging import logger
from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.postgresql import get_db
from src.exceptions.exceptions import CustomException, GenericError, NotFoundError
from src.schemas.lookup import LookupResponse, LookupType
from src.services.lookup_service import LookupService
from src.utils.api_helpers import get_responses

logger = logger.bind(service="lookups", context="api", action="lookups")

router = APIRouter(
    prefix="/lookups",
    tags=["lookups"],
    responses=get_responses(),
)


@router.get("", status_code=status.HTTP_200_OK, response_model=List[LookupResponse])
def get_lookups(lookup_type: LookupType, db: Session = Depends(get_db)):
    try:
        lookups = LookupService(session=db).get_by_lookup_type(lookup_type=lookup_type.value)
        if not lookups:
            raise NotFoundError(f"No lookups found for {lookup_type}")

        return lookups
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error fetching lookups", lookup_type=lookup_type, error=err)
        raise GenericError(f"Oops, something went wrong while fetching lookups for {lookup_type}")
