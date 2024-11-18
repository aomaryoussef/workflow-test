import os
import json

from config.settings import settings
from src.config.logging import logger
from src.exceptions.exceptions import DataAccessError, FileAccessError

logger = logger.bind(service="job_salary", context="repository", action="job_salary")
salary_mapping_file_path = settings.get("salary_mapping", default={}).get("path")


class JobSalaryRepository:
    """
    Initializes the JobSalaryRepository with a predefined salary mapping for different job categories.
    The salary mapping is loaded from a JSON file.
    """

    def __init__(self, file_path: str = salary_mapping_file_path):
        """
        Initializes the JobSalaryRepository by loading the salary mapping from the specified JSON file.

        Args:
            file_path (str): The path to the JSON file containing the salary mapping. Defaults to 'resources/data/job_salary_mapping.json'.
        """
        self._salary_mapping = self._load_salary_mapping(file_path)

    def _load_salary_mapping(self, file_path: str) -> dict:
        """
        Loads the salary mapping from a JSON file.

        Args:
            file_path (str): The path to the JSON file.

        Returns:
            dict: A dictionary containing job categories and their corresponding salary ranges.

        Raises:
            FileNotFoundError: If the specified JSON file does not exist.
            FileAccessError: If there is an error parsing the JSON file.
        """
        if not os.path.exists(file_path):
            logger.error(f"salary mapping file could not be found", file_path=file_path)
            raise FileNotFoundError(f"Salary mapping file could not be loaded. the file '{file_path}' does not exist")

        try:
            with open(file_path, 'r') as file:
                salary_mapping = json.load(file)
        except Exception as err:
            logger.error(f"error loading salary mapping file", file_path=file_path, error=err)
            raise FileAccessError()

        return salary_mapping

    def get_min_and_max_by_job_map(self, job_map: str) -> dict:
        """
        Retrieves the minimum and maximum salary range for a given job category.

        Args:
            job_map (str): The key representing a specific job category.

        Returns:
            dict: A dictionary containing 'job_map_min_salary' and 'job_map_max_salary' for the specified job category.

        Raises:
            DataAccessError: If the job category provided does not exist in the salary mapping or another error occurs.

        Example:
            >>> repo = JobSalaryRepository()
            >>> repo.get_min_and_max_by_job_map("engineer")
            {'job_map_min_salary': 10000, 'job_map_max_salary': 30000}
        """
        try:
            return self._salary_mapping[job_map]
        except Exception as err:
            logger.error(f"error getting min and max salary by job name map", job_map=job_map, error=err)
            raise DataAccessError(
                f"error getting min and max salary by job name map {job_map}. Please type a valid job name map")
