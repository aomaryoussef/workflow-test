import pytest
import pandas as pd
from src.ml.models.calculation_center_model import CalculationCenterModel
from src.services.calculation_center_model_service import CalculationCenterModelService


@pytest.fixture
def mock_repositories(db_session):
    """Mock the repositories with a real session."""
    from src.repositories.scoring_output_repository import ScoringOutputRepository
    from src.repositories.model_repository import ModelRepository
    from src.repositories.run_repository import RunRepository

    scoringoutput_repo = ScoringOutputRepository(db_session)
    model_repo = ModelRepository(db_session)
    run_repo = RunRepository(db_session)

    return {
        "scoringoutput_repo": scoringoutput_repo,
        "model_repo": model_repo,
        "run_repo": run_repo,
    }


@pytest.fixture
def mock_model():
    """Return a mock CalculationCenterModel instance."""
    return CalculationCenterModel(parameters={"param1": "value1"})


@pytest.fixture
def service(db_session, mock_repositories, monkeypatch, mock_model):
    """Fixture for initializing the CalculationCenterModelService with mocks."""
    # Patch the CalculationCenterModel to return the mock model
    monkeypatch.setattr(
        'src.services.calculation_center_service.CalculationCenterModel',
        lambda **kwargs: mock_model
    )

    service = CalculationCenterModelService(session=db_session)
    service.scoringoutput_repository = mock_repositories["scoringoutput_repo"]
    return service


def test_execute_success(service, mock_model, monkeypatch):
    """Test the successful execution of the CalculationCenterModelService."""

    # Mock the calculate method of CalculationCenterModel to return a specific result
    def mock_calculate(self, df):
        return {
            "ar_status": "approved",
            "calc_credit_limit": 5000,
            "pd_predictions": [0.1, 0.2],
            "income_predictions": [40000],
            "income_zone": "zone1",
            "final_net_income": 35000,
            "cwf_segment": "segment1",
            "cwf": 1
        }

    monkeypatch.setattr(CalculationCenterModel, 'calculate', mock_calculate)

    # Prepare mock DataFrame
    df = pd.DataFrame({
        "ssn": ["123-45-6789"],
        "client_id": ["client-1"],
        "some_feature": [10],
    })

    # Mock the log_run method to avoid side effects during testing
    def mock_log_run(*args, **kwargs):
        return type('Run', (), {"id": 1})  # Returns a simple object with an id attribute

    monkeypatch.setattr(service, 'log_run', mock_log_run)

    # Mock the create method of the repository
    created_scoring_output = []

    def mock_create(output):
        created_scoring_output.append(output)

    monkeypatch.setattr(service.scoringoutput_repository, 'create', mock_create)

    # Execute the service method
    result = service.execute(df)

    # Assertions
    assert result["ar_status"] == "approved"
    assert result["calc_credit_limit"] == 5000

    # Verify that scoring output was created
    assert len(created_scoring_output) == 1
    assert created_scoring_output[0].ar_status == "approved"
    assert created_scoring_output[0].calc_credit_limit == 5000


def test_execute_failure(service, monkeypatch):
    """Test the failure path of the CalculationCenterModelService."""

    # Mock the calculate method to raise an exception
    def mock_calculate(self, df):
        raise Exception("Calculation failed")

    monkeypatch.setattr(CalculationCenterModel, 'calculate', mock_calculate)

    # Prepare mock DataFrame
    df = pd.DataFrame({
        "ssn": ["123-45-6789"],
        "client_id": ["client-1"],
        "some_feature": [10],
    })

    # Mock the log_run method to avoid side effects during testing
    def mock_log_run(*args, **kwargs):
        return type('Run', (), {"id": 1})  # Returns a simple object with an id attribute

    monkeypatch.setattr(service, 'log_run', mock_log_run)

    # Mock the create method of the repository
    created_scoring_output = []

    def mock_create(output):
        created_scoring_output.append(output)

    monkeypatch.setattr(service.scoringoutput_repository, 'create', mock_create)

    # Execute the service method and expect an exception
    with pytest.raises(Exception, match="Calculation failed"):
        service.execute(df)

    # Verify that no scoring output was created
    assert len(created_scoring_output) == 0
