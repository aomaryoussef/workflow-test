import pytest
import json
from src.repositories.job_salary_repository import JobSalaryRepository
from src.exceptions.exceptions import DataAccessError, FileAccessError


@pytest.fixture
def mock_salary_mapping_file(tmp_path):
    """
    Fixture to create a mock salary mapping JSON file for testing.
    """
    file_path = tmp_path / "job_salary_mapping.json"
    data = {
        "engineer": {"job_map_min_salary": 10000, "job_map_max_salary": 30000},
        "teacher": {"job_map_min_salary": 8000, "job_map_max_salary": 20000}
    }
    with open(file_path, "w") as f:
        json.dump(data, f)
    return str(file_path)


@pytest.fixture
def job_salary_repository(mock_salary_mapping_file):
    """
    Fixture to create a JobSalaryRepository instance using the mock salary mapping file.
    """
    return JobSalaryRepository(file_path=mock_salary_mapping_file)


def test_load_salary_mapping_success(job_salary_repository: JobSalaryRepository):
    """Test that the salary mapping is loaded successfully."""
    salary_mapping = job_salary_repository._salary_mapping

    assert salary_mapping is not None
    assert "engineer" in salary_mapping
    assert salary_mapping["engineer"]["job_map_min_salary"] == 10000
    assert salary_mapping["engineer"]["job_map_max_salary"] == 30000


def test_load_salary_mapping_file_not_found():
    """Test that a FileNotFoundError is raised if the file does not exist."""
    with pytest.raises(FileNotFoundError):
        JobSalaryRepository(file_path="non_existent_file.json")


def test_load_salary_mapping_file_access_error(tmp_path, monkeypatch):
    """Test that a FileAccessError is raised if there is an error parsing the JSON file."""
    invalid_file_path = tmp_path / "invalid_job_salary_mapping.json"
    invalid_file_path.write_text("invalid_json_content")

    with pytest.raises(FileAccessError):
        JobSalaryRepository(file_path=str(invalid_file_path))


def test_get_min_and_max_by_job_map_success(job_salary_repository: JobSalaryRepository):
    """Test retrieving the minimum and maximum salary for a valid job category."""
    salary_range = job_salary_repository.get_min_and_max_by_job_map("engineer")

    assert salary_range["job_map_min_salary"] == 10000
    assert salary_range["job_map_max_salary"] == 30000


def test_get_min_and_max_by_job_map_data_access_error(job_salary_repository: JobSalaryRepository):
    """Test that a DataAccessError is raised when requesting a non-existent job category."""
    with pytest.raises(DataAccessError):
        job_salary_repository.get_min_and_max_by_job_map("non_existent_job")
