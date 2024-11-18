import requests
import json
from src.config.logging import logger
from config.settings import settings

logger = logger.bind(service="iscore", context="adapters", action="iscore")

ISCORE_URL = settings.get("iscore", default={}).get("url")
ISCORE_USER_ID = settings.get("iscore", default={}).get("user_id")
ENABLE_ISCORE_CALL = settings.get("iscore", default={}).get("enable_iscore_call")


class IScoreAdapter:
    def get_score(self, national_id: str) -> dict or None:
        """
        Retrieves the credit score information for a given national ID.

        Args:
            national_id (str): The national ID to retrieve the score for.

        Returns:
            dict or None: A dictionary containing the score details, or None if there was an error.

        Raises:
            Exception: If the national ID is invalid.
        """
        is_national_id_valid = self._validate_national_id(national_id)
        if not is_national_id_valid:
            logger.error(f"national_id {national_id} is not valid")
            raise Exception("National ID is not valid")

        payload = json.dumps({
            "NationalID": national_id,
            "Userid": ISCORE_USER_ID
        })

        headers = {
            'Content-Type': 'application/json',
        }

        res = {
            "ssn": None,
            "status": None,
            "score": None,
            "report": None,
            "raw_data": None
        }

        if not ENABLE_ISCORE_CALL:
            logger.info(f"fetching iScore is disabled in testing, skipping...")
            res['status'] = False
            return res

        response = requests.post(
            url=ISCORE_URL,
            headers=headers,
            data=payload,
            timeout=120
        )

        res['raw_data'] = response.text

        if response.status_code != 200:
            logger.error(f"Failed to get iscore for national_id {national_id}")
            res['status'] = False
            return res

        try:
            data = response.json()
        except Exception as err:
            logger.error(f"failed to get iscore for national_id {national_id}", error=err)
            res['status'] = False
            return res

        ssn = data.get('SSN')
        status = data.get('status')
        score = data.get('Score')
        report = data.get('IscoreReportSbx')

        if not status or score is None or report is None:
            logger.error(f"Failed to get iscore for national_id {national_id}")
            res['status'] = False
            return res

        # check if report is a json or dict, otherwise this will fail when storing in the database
        if not self._is_report_valid(report):
            logger.error(f"failed to parse iscore report")
            res['status'] = False
            return res

        res['ssn'] = ssn
        res['status'] = status
        res['score'] = score
        res['report'] = report

        return res

    def _validate_national_id(self, national_id: str) -> bool:
        """
        Validates the national ID format.

        Args:
            national_id (str): The national ID to validate.

        Returns:
            bool: True if the national ID is valid, False otherwise.
        """
        return national_id is not None and len(national_id) == 14

    def _is_report_valid(self, report: dict) -> bool:
        """
        Validates the report.

        Args:
            report (dict): The report to validate.

        Returns:
            bool: True if the report is valid, False otherwise.
        """
        try:
            json.dumps(report)
            return True
        except Exception as err:
            return False
