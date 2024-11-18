from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.config.postgresql import get_db
from src.exceptions.exceptions import NotFoundError, CustomException, GenericError, CreationError, UpdateError
from src.schemas.model import ModelRead, ModelCreate, ModelUpdate
from src.services.model_service import ModelService
from src.config.logging import logger
from src.utils.api_helpers import get_responses

logger = logger.bind(service="models", context="api", action="models")

router = APIRouter(
    prefix="/models",
    tags=["models"],
    responses=get_responses()
)


@router.get("/{model_id}", response_model=ModelRead)
def get_model(model_id: UUID, db: Session = Depends(get_db)):
    try:
        model = ModelService(session=db).get(model_id)
        if model is None:
            raise NotFoundError(f"Model with id {model_id} not found")
        return model
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error fetching model", model_id=model_id, error=err)
        raise GenericError(f"Oops, something went wrong while fetching model {model_id}")


@router.get("", response_model=List[ModelRead])
def list_models(db: Session = Depends(get_db)):
    try:
        models = ModelService(session=db).list()
        return models
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error fetching models", error=err)
        raise GenericError("Oops, something went wrong while fetching models")


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ModelRead)
def create_model(model: ModelCreate, db: Session = Depends(get_db)):
    try:
        return ModelService(session=db).create(model)
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error in creating model", error=err)
        raise CreationError("Oops, something went wrong while creating the model")


@router.patch("/{model_id}", status_code=status.HTTP_200_OK)
def update_model(model_id: UUID, model_update: ModelUpdate, db: Session = Depends(get_db)):
    try:
        data = model_update.dict(exclude_unset=True)
        model = ModelService(session=db).update(model_id, data)
        return model
    except CustomException as err:
        raise err
    except Exception as err:
        logger.error("error in updating model", model_id=model_id, error=err)
        raise UpdateError(f"Oops, something went wrong while updating the model {model_id}")
