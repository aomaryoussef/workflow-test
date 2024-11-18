from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from src.exceptions.exceptions import NotFoundError, CreationError, UpdateError, DeletionError
from src.models.model import Model
from sqlalchemy.exc import SQLAlchemyError
from src.config.logging import logger

logger = logger.bind(service="model", context="repository", action="model")


class ModelRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_id(self, model_id: UUID) -> Model or None:
        """
        Retrieve a model by its UUID.

        Args:
            model_id (UUID): The UUID of the model.

        Returns:
            Model or None: The model if found, None otherwise
        """
        try:
            model = self.session.query(Model).filter(Model.id == model_id).first()
            if model is None:
                logger.debug(f"model with id {model_id} not found")
                return None
            return model
        except SQLAlchemyError as err:
            logger.error(f"error fetching model by id", model_id=model_id, error=err)
            return None

    def list(self) -> List[Model]:
        """
        Retrieve all models.

        Returns:
            List[Model]: A list of all models.
        """
        try:
            return self.session.query(Model).all()
        except SQLAlchemyError as err:
            logger.error(f"error fetching all models", error=err)
            return []

    def get_by_name_and_version(self, name: str, version: int) -> Optional[Model]:
        """
        Retrieve a model by its name and version.

        Args:
            name (str): The name of the model.
            version (int): The version of the model.

        Returns:
            Optional[Model]: The model if found, None otherwise.

        Raises:
            NotFoundError: If the model is not found.
        """
        try:
            model = self.session.query(Model).filter(
                Model.name == name,
                Model.version == version,
                Model.is_active == True
            ).first()
            if model is None:
                logger.debug(f"model not found", name=name, version=version)
            return model
        except SQLAlchemyError as err:
            logger.error(f"error fetching model by name and version {version}", error=err)
            return None

    def create(self, model: Model) -> Optional[Model]:
        """
        Create a new model.

        Args:
            model (Model): The model to create.

        Returns:
            Optional[Model]: The created model.

        Raises:
            CreationError: If an error occurs while creating the model.
        """
        try:
            self.session.add(model)
            self.session.commit()
            self.session.refresh(model)
            logger.debug(f"model with id {model.id} created successfully")
            return model
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error creating model", error=err)
            raise CreationError(f"Oops, something went wrong while creating the model")

    def update(self, model_id: UUID, update_data: dict) -> Optional[Model]:
        """
        Update an existing model.

        Args:
            model_id (UUID): The UUID of the model to update.
            update_data (dict): The data to update.

        Returns:
            Optional[Model]: The updated model.

        Raises:
            NotFoundError: If the model is not found.
            UpdateError: If an error occurs while updating the model.
        """
        try:
            model = self.get_by_id(model_id)
            if model is None:
                raise NotFoundError(f"model with id {model_id} not found")

            for key, value in update_data.items():
                setattr(model, key, value)

            self.session.commit()
            self.session.refresh(model)
            logger.debug(f"model with id {model.id} updated successfully")
            return model
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error updating model", model_id=model_id, error=err)
            raise UpdateError(f"Oops, something went wrong while updating the model")

    def delete(self, model_id: UUID) -> bool:
        """
        Delete a model by its UUID.

        Args:
            model_id (UUID): The UUID of the model to delete.

        Returns:
            bool: True if the model is deleted successfully.

        Raises:
            NotFoundError: If the model is not found.
            DeletionError: If an error occurs while deleting the model.
        """
        try:
            model = self.get_by_id(model_id)
            if model is None:
                raise NotFoundError(f"model with id {model_id} not found")
            self.session.delete(model)
            self.session.commit()
            logger.debug(f"model with id {model.id} deleted successfully.")
            return True
        except SQLAlchemyError as err:
            self.session.rollback()
            logger.error(f"error deleting model", model_id=model_id, error=err)
            raise DeletionError(f"Oops, something went wrong while deleting the model")
