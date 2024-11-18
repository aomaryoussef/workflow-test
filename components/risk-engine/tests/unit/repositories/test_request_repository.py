import pytest
from uuid import uuid4
from src.models.request import Request, RequestScenarioType
from src.repositories.request_repository import RequestRepository
from src.exceptions.exceptions import CreationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime


@pytest.fixture(scope="function")
def request_repository(db_session):
    """Fixture to create a new RequestRepository for each test."""
    return RequestRepository(session=db_session)


def test_create_request_success(request_repository: RequestRepository):
    """Test creating a new request successfully."""
    new_request = Request(
        id=uuid4(),
        consumer_id=uuid4(),
        scenario=RequestScenarioType.SCORING,
        input_data={"key": "value"},
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    created_request = request_repository.create(new_request)

    assert created_request is not None
    assert created_request.id == new_request.id
    assert created_request.consumer_id == new_request.consumer_id
    assert created_request.scenario == RequestScenarioType.SCORING
    assert created_request.input_data == {"key": "value"}
    assert created_request.trace_id == "trace-123"
    assert isinstance(created_request.created_at, datetime)


def test_create_request_integrity_error(request_repository: RequestRepository, monkeypatch):
    """Test handling of IntegrityError when creating a request."""
    new_request = Request(
        id=uuid4(),
        consumer_id=uuid4(),
        scenario=RequestScenarioType.SCORING,
        input_data={"key": "value"},
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.add to raise IntegrityError
    def mock_add(*args, **kwargs):
        raise SQLAlchemyError("Mock integrity error")

    monkeypatch.setattr(request_repository.session, "add", mock_add)

    with pytest.raises(CreationError):
        request_repository.create(new_request)


def test_create_request_sqlalchemy_error(request_repository: RequestRepository, monkeypatch):
    """Test handling of SQLAlchemyError when creating a request."""
    new_request = Request(
        id=uuid4(),
        consumer_id=uuid4(),
        scenario=RequestScenarioType.SCORING,
        input_data={"key": "value"},
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.commit to raise SQLAlchemyError
    def mock_commit(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(request_repository.session, "commit", mock_commit)

    with pytest.raises(CreationError):
        request_repository.create(new_request)
