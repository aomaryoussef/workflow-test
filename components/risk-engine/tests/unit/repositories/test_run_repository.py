import pytest
from uuid import uuid4
from src.models.run import Run, RunStatusType
from src.repositories.run_repository import RunRepository
from src.exceptions.exceptions import CreationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime


@pytest.fixture(scope="function")
def run_repository(db_session):
    """Fixture to create a new RunRepository for each test."""
    return RunRepository(session=db_session)


def test_create_run_success(run_repository: RunRepository):
    """Test creating a new run successfully."""
    new_run = Run(
        id=uuid4(),
        request_id=uuid4(),
        model_id=uuid4(),
        input_data={"key": "input_value"},
        output_data={"key": "output_value"},
        execution_duration_ms=1200,
        status=RunStatusType.SUCCESS,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    created_run = run_repository.create(new_run)

    assert created_run is not None
    assert created_run.id == new_run.id
    assert created_run.request_id == new_run.request_id
    assert created_run.model_id == new_run.model_id
    assert created_run.input_data == {"key": "input_value"}
    assert created_run.output_data == {"key": "output_value"}
    assert created_run.execution_duration_ms == 1200
    assert created_run.status == RunStatusType.SUCCESS
    assert created_run.trace_id == "trace-123"
    assert isinstance(created_run.created_at, datetime)


def test_create_run_integrity_error(run_repository: RunRepository, monkeypatch):
    """Test handling of IntegrityError when creating a run."""
    new_run = Run(
        id=uuid4(),
        request_id=uuid4(),
        model_id=uuid4(),
        input_data={"key": "input_value"},
        output_data={"key": "output_value"},
        execution_duration_ms=1200,
        status=RunStatusType.SUCCESS,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.add to raise IntegrityError
    def mock_add(*args, **kwargs):
        raise SQLAlchemyError("Mock integrity error")

    monkeypatch.setattr(run_repository.session, "add", mock_add)

    with pytest.raises(CreationError):
        run_repository.create(new_run)


def test_create_run_sqlalchemy_error(run_repository: RunRepository, monkeypatch):
    """Test handling of SQLAlchemyError when creating a run."""
    new_run = Run(
        id=uuid4(),
        request_id=uuid4(),
        model_id=uuid4(),
        input_data={"key": "input_value"},
        output_data={"key": "output_value"},
        execution_duration_ms=1200,
        status=RunStatusType.SUCCESS,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.commit to raise SQLAlchemyError
    def mock_commit(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(run_repository.session, "commit", mock_commit)

    with pytest.raises(CreationError):
        run_repository.create(new_run)
