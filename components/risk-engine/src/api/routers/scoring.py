from src.config.logging import logger
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from src.config.postgresql import get_db
from src.exceptions.exceptions import DataAccessError, CustomException, GenericError
from src.schemas.application import CreditScoreInput
from src.schemas.credit_score import CreditScoreOutput
from src.services.scoring_service import ScoringService
from src.utils.api_helpers import get_responses

logger = logger.bind(service="scoring", context="api", action="scoring")

router = APIRouter(
    prefix="/score",
    tags=["score"],
    responses=get_responses(),
)


@router.post("", status_code=status.HTTP_200_OK, response_model=CreditScoreOutput)
def get_score(input_data: CreditScoreInput,
              trace_id: str = Query(None, description="Trace Id for the request", alias="trace_id"),
              db: Session = Depends(get_db)):
    try:
        raw_data = input_data.dict()
    except Exception as err:
        logger.error("error in reading data", error=err)
        raise DataAccessError("Oops, something went wrong while reading the input data")
    try:
        booking_time = input_data.dict().get("booking_time")
        scoring = ScoringService(session=db).get_score(raw_data=raw_data, booking_time=booking_time)
        return scoring
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error in getting score", error=err)
        raise GenericError("Oops, something went wrong while getting the score")