import pytest
from unittest.mock import MagicMock
from uuid import uuid4

from src.exceptions.exceptions import ConflictError
from src.models.model import Model, ModelType
from src.schemas.model import ModelCreate
from src.services.model_service import ModelService
from src.repositories.model_repository import ModelRepository


@pytest.fixture
def mock_session():
    return MagicMock()


@pytest.fixture
def mock_model_repository(mock_session):
    return MagicMock(spec=ModelRepository)


@pytest.fixture
def model_service(mock_session, mock_model_repository):
    service = ModelService(session=mock_session)
    service.model_repository = mock_model_repository
    return service


def test_get_model(model_service, mock_model_repository):
    mock_model_id = uuid4()
    expected_model = Model(id=mock_model_id, name="TestModel", type=ModelType.PRE_PROCESSING, version=1)

    mock_model_repository.get_by_id.return_value = expected_model

    model = model_service.get(mock_model_id)

    assert model == expected_model
    mock_model_repository.get_by_id.assert_called_once_with(mock_model_id)


def test_get_by_name_and_version(model_service, mock_model_repository):
    expected_model = Model(name="TestModel", type=ModelType.PRE_PROCESSING, version=1)

    mock_model_repository.get_by_name_and_version.return_value = expected_model

    model = model_service.get_by_name_and_version("TestModel", 1)

    assert model == expected_model
    mock_model_repository.get_by_name_and_version.assert_called_once_with("TestModel", 1)


def test_list_models(model_service, mock_model_repository):
    expected_models = [
        Model(name="TestModel1", type=ModelType.PRE_PROCESSING, version=1),
        Model(name="TestModel2", type=ModelType.CALCULATIONS, version=2),
    ]

    mock_model_repository.list.return_value = expected_models

    models = model_service.list()

    assert models == expected_models
    mock_model_repository.list.assert_called_once()


def test_create_model(model_service, mock_model_repository):
    new_model_data = ModelCreate(
        name="NewModel", type=ModelType.ML, version=1, is_active=True
    )

    mock_model_repository.get_by_name_and_version.return_value = None
    mock_model_repository.create.return_value = Model(
        id=uuid4(), name="NewModel", type=ModelType.ML, version=1, is_active=True
    )

    model = model_service.create(new_model_data)

    assert model.name == new_model_data.name
    assert model.type == new_model_data.type
    assert model.version == new_model_data.version
    mock_model_repository.get_by_name_and_version.assert_called_once_with("NewModel", 1)
    mock_model_repository.create.assert_called_once()


def test_create_model_conflict(model_service, mock_model_repository):
    existing_model = Model(name="ExistingModel", type=ModelType.ML, version=1, is_active=True)

    mock_model_repository.get_by_name_and_version.return_value = existing_model

    new_model_data = ModelCreate(
        name="ExistingModel", type=ModelType.ML, version=1, is_active=True
    )

    with pytest.raises(ConflictError) as excinfo:
        model_service.create(new_model_data)

    assert str(excinfo.value) == "model with the same name and version already exists"
    mock_model_repository.get_by_name_and_version.assert_called_once_with("ExistingModel", 1)
    mock_model_repository.create.assert_not_called()


def test_update_model(model_service, mock_model_repository):
    model_id = uuid4()
    updated_data = {"is_active": False}
    expected_model = Model(id=model_id, name="TestModel", type=ModelType.ML, version=1, is_active=False)

    mock_model_repository.update.return_value = expected_model

    model = model_service.update(model_id, updated_data)

    assert model.is_active is False
    mock_model_repository.update.assert_called_once_with(model_id, updated_data)


def test_delete_model(model_service, mock_model_repository):
    model_id = uuid4()

    mock_model_repository.delete.return_value = True

    result = model_service.delete(model_id)

    assert result is True
    mock_model_repository.delete.assert_called_once_with(model_id)
