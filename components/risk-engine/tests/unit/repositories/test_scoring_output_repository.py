import pytest
from uuid import uuid4

from src.models.request import Request, RequestScenarioType
from src.models.run import Run, RunStatusType
from src.models.scoring_output import ScoringOutput
from src.repositories.request_repository import RequestRepository
from src.repositories.run_repository import RunRepository
from src.repositories.scoring_output_repository import ScoringOutputRepository
from src.exceptions.exceptions import CreationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime


@pytest.fixture(scope="function")
def scoring_output_repository(db_session):
    """Fixture to create a new ScoringOutputRepository for each test."""
    return ScoringOutputRepository(session=db_session)


@pytest.fixture(scope="function")
def run_repository(db_session):
    """Fixture to create a new RunRepository for each test."""
    return RunRepository(session=db_session)


@pytest.fixture(scope="function")
def request_repository(db_session):
    """Fixture to create a new RequestRepository for each test."""
    return RequestRepository(session=db_session)


def test_create_scoring_output_success(scoring_output_repository: ScoringOutputRepository,
                                       run_repository: RunRepository, request_repository: RequestRepository):
    """Test creating a new scoring output successfully."""
    new_request = Request(
        id=uuid4(),
        consumer_id=uuid4(),
        scenario=RequestScenarioType.SCORING,
        input_data={"key": "value"},
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )
    created_request = request_repository.create(new_request)

    new_run = Run(
        id=uuid4(),
        request_id=created_request.id,
        model_id="8a0371f3-ded8-4a00-980a-66cc6709ca30",
        input_data={"key": "input_value"},
        output_data={"key": "output_value"},
        execution_duration_ms=1200,
        status=RunStatusType.SUCCESS,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )
    created_run = run_repository.create(new_run)

    new_scoring_output = ScoringOutput(
        id=uuid4(),
        consumer_ssn="12345678998765",
        consumer_id=uuid4(),
        runs_id=created_run.id,
        request_id=created_request.id,
        ar_status="Active",
        calc_credit_limit=15000,
        pd_predictions=0.05,
        income_predictions=70000,
        income_zone="Green",
        final_net_income=50000,
        cwf_segment="A",
        cwf=100,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    created_scoring_output = scoring_output_repository.create(new_scoring_output)

    assert created_scoring_output is not None
    assert created_scoring_output.id == new_scoring_output.id
    assert created_scoring_output.consumer_ssn == "12345678998765"
    assert created_scoring_output.consumer_id == new_scoring_output.consumer_id
    assert created_scoring_output.runs_id == new_scoring_output.runs_id
    assert created_scoring_output.request_id == new_scoring_output.request_id
    assert created_scoring_output.ar_status == "Active"
    assert created_scoring_output.calc_credit_limit == 15000
    assert created_scoring_output.pd_predictions == 0.05
    assert created_scoring_output.income_predictions == 70000
    assert created_scoring_output.income_zone == "Green"
    assert created_scoring_output.final_net_income == 50000
    assert created_scoring_output.cwf_segment == "A"
    assert created_scoring_output.cwf == 100
    assert created_scoring_output.trace_id == "trace-123"
    assert isinstance(created_scoring_output.created_at, datetime)


def test_create_scoring_output_integrity_error(scoring_output_repository: ScoringOutputRepository, monkeypatch):
    """Test handling of IntegrityError when creating a scoring output."""
    new_scoring_output = ScoringOutput(
        id=uuid4(),
        consumer_ssn="12345678998765",
        consumer_id=uuid4(),
        runs_id=uuid4(),
        request_id=uuid4(),
        ar_status="Active",
        calc_credit_limit=15000,
        pd_predictions=0.05,
        income_predictions=70000,
        income_zone="Green",
        final_net_income=50000,
        cwf_segment="A",
        cwf=100,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.add to raise IntegrityError
    def mock_add(*args, **kwargs):
        raise SQLAlchemyError("Mock integrity error")

    monkeypatch.setattr(scoring_output_repository.session, "add", mock_add)

    with pytest.raises(CreationError):
        scoring_output_repository.create(new_scoring_output)


def test_create_scoring_output_sqlalchemy_error(scoring_output_repository: ScoringOutputRepository, monkeypatch):
    """Test handling of SQLAlchemyError when creating a scoring output."""
    new_scoring_output = ScoringOutput(
        id=uuid4(),
        consumer_ssn="123-45-6789",
        consumer_id=uuid4(),
        runs_id=uuid4(),
        request_id=uuid4(),
        ar_status="Active",
        calc_credit_limit=15000,
        pd_predictions=0.05,
        income_predictions=70000,
        income_zone="Green",
        final_net_income=50000,
        cwf_segment="A",
        cwf=100,
        trace_id="trace-123",
        booking_time=datetime.utcnow()
    )

    # Use monkeypatch to mock session.commit to raise SQLAlchemyError
    def mock_commit(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(scoring_output_repository.session, "commit", mock_commit)

    with pytest.raises(CreationError):
        scoring_output_repository.create(new_scoring_output)
