from typing import List
from uuid import UUID
from sqlalchemy.orm import Session

from src.exceptions.exceptions import ConflictError
from src.models.model import Model
from src.repositories.model_repository import ModelRepository
from src.schemas.model import ModelCreate
from src.services.base_repository_service import BaseRepositoryService


class ModelService(BaseRepositoryService):
    model_repository: ModelRepository

    def __init__(self, session: Session = None):
        super().__init__(session, [ModelRepository])

    def get(self, model_id: UUID) -> Model:
        """
        Get model by id

        Args:
            model_id: Model id

        Returns:
            Model: Model object
        """
        return self.model_repository.get_by_id(model_id)

    def get_by_name_and_version(self, name: str, version: int) -> Model:
        """
        Get model by name and version

        Args:
            name: Model name
            version: Model version

        Returns:
            Model: Model object

        """
        return self.model_repository.get_by_name_and_version(name, version)

    def list(self) -> List[Model]:
        """
        Get list of all models

        Returns:
            List[Model]: List of model objects

        """
        return self.model_repository.list()

    def update(self, model_id: UUID, data: dict) -> Model or None:
        """
        Update model by id

        Args:
            model_id: Model id
            data: Data to update

        Returns:
            Model: Updated model object
        """
        return self.model_repository.update(model_id, data)

    def create(self, model: ModelCreate) -> Model or None:
        """
        Create a new model

        Args:
            model: ModelCreate object

        Returns:
            Model: Created model object

        Raises:
            ConflictError: If a model with the same name and version already exists
        """
        get_model = self.get_by_name_and_version(model.name, model.version)

        if get_model is not None:
            raise ConflictError("model with the same name and version already exists")

        model_obj = Model(
            name=model.name,
            type=model.type,
            is_active=model.is_active,
            version=model.version
        )

        # Optional fields, if they exist in the request body they will be added to the model object
        # doing this because otherwise it gets saved as null string in the database
        if model.features_names is not None:
            model_obj.features_names = model.features_names
        if model.features_dtypes is not None:
            model_obj.features_dtypes = model.features_dtypes
        if model.parameters is not None:
            model_obj.parameters = model.parameters

        return self.model_repository.create(model_obj)

    def delete(self, model_id: UUID) -> bool:
        return self.model_repository.delete(model_id)
