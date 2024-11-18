import pytest
from uuid import uuid4
from src.models.model import Model
from src.repositories.model_repository import ModelRepository
from src.exceptions.exceptions import NotFoundError, CreationError, UpdateError, DeletionError
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from src.schemas.model import ModelType


@pytest.fixture(scope="function")
def model_repository(db_session):
    """Fixture to create a new ModelRepository for each test."""
    return ModelRepository(session=db_session)


def test_create_model_success(model_repository: ModelRepository):
    """Test creating a new model successfully."""
    new_model = Model(
        id=uuid4(),
        name="Test Model",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    created_model = model_repository.create(new_model)

    assert created_model is not None
    assert created_model.id == new_model.id
    assert created_model.name == "Test Model"
    assert created_model.type.value == ModelType.ML
    assert created_model.version == 1
    assert created_model.is_active is True


def test_create_model_integrity_error(model_repository: ModelRepository, monkeypatch):
    """Test handling of IntegrityError when creating a model."""
    new_model = Model(
        id=uuid4(),
        name="Test Model",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Use monkeypatch to mock session.add to raise IntegrityError
    def mock_add(*args, **kwargs):
        raise IntegrityError("Mock integrity error", {}, None)

    monkeypatch.setattr(model_repository.session, "add", mock_add)

    with pytest.raises(CreationError):
        model_repository.create(new_model)


def test_get_model_by_id_success(model_repository: ModelRepository):
    """Test retrieving a model by its ID successfully."""
    new_model = Model(
        id=uuid4(),
        name="Test Model",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Create the model first
    model_repository.create(new_model)

    # Fetch the model by ID
    fetched_model = model_repository.get_by_id(new_model.id)

    assert fetched_model is not None
    assert fetched_model.id == new_model.id
    assert fetched_model.name == "Test Model"


def test_get_model_by_id_not_found(model_repository: ModelRepository):
    """Test handling when a model is not found by ID."""
    non_existent_id = uuid4()

    fetched_model = model_repository.get_by_id(non_existent_id)

    assert fetched_model is None


def test_get_model_by_id_sqlalchemy_error(model_repository: ModelRepository, monkeypatch):
    """Test handling of SQLAlchemyError when retrieving a model by ID."""
    new_model_id = uuid4()

    # Mock session.query.filter.first to raise SQLAlchemyError
    def mock_first(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(model_repository.session.query(Model).filter(Model.id == new_model_id), "first", mock_first)

    fetched_model = model_repository.get_by_id(new_model_id)

    assert fetched_model is None


def test_update_model_success(model_repository: ModelRepository):
    """Test updating an existing model successfully."""
    new_model = Model(
        id=uuid4(),
        name="Old Model Name",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Create the model first
    model_repository.create(new_model)

    # Update the model
    update_data = {"name": "Updated Model Name"}
    updated_model = model_repository.update(new_model.id, update_data)

    assert updated_model is not None
    assert updated_model.name == "Updated Model Name"


def test_update_model_not_found(model_repository: ModelRepository):
    """Test handling when updating a model that does not exist."""
    non_existent_id = uuid4()

    update_data = {"name": "Updated Model Name"}

    with pytest.raises(NotFoundError):
        model_repository.update(non_existent_id, update_data)


def test_update_model_integrity_error(model_repository: ModelRepository, monkeypatch):
    """Test handling of IntegrityError when updating a model."""
    new_model = Model(
        id=uuid4(),
        name="Old Model Name",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Create the model first
    model_repository.create(new_model)

    # Mock session.commit to raise IntegrityError
    def mock_commit(*args, **kwargs):
        raise IntegrityError("Mock integrity error", {}, None)

    monkeypatch.setattr(model_repository.session, "commit", mock_commit)

    update_data = {"name": "Updated Model Name"}

    with pytest.raises(UpdateError):
        model_repository.update(new_model.id, update_data)


def test_delete_model_success(model_repository: ModelRepository):
    """Test deleting a model successfully."""
    new_model = Model(
        id=uuid4(),
        name="Test Model",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Create the model first
    model_repository.create(new_model)

    # Delete the model
    delete_success = model_repository.delete(new_model.id)

    assert delete_success is True

    # Verify that the model no longer exists
    deleted_model = model_repository.get_by_id(new_model.id)
    assert deleted_model is None


def test_delete_model_not_found(model_repository: ModelRepository):
    """Test handling when deleting a model that does not exist."""
    non_existent_id = uuid4()

    with pytest.raises(NotFoundError):
        model_repository.delete(non_existent_id)


def test_delete_model_sqlalchemy_error(model_repository: ModelRepository, monkeypatch):
    """Test handling of SQLAlchemyError when deleting a model."""
    new_model = Model(
        id=uuid4(),
        name="Test Model",
        type=ModelType.ML,
        version=1,
        is_active=True
    )

    # Create the model first
    model_repository.create(new_model)

    # Mock session.delete to raise SQLAlchemyError
    def mock_delete(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(model_repository.session, "delete", mock_delete)

    with pytest.raises(DeletionError):
        model_repository.delete(new_model.id)
