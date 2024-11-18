import requests
from config.settings import settings
from src.services.logging import logger

mini_cash_base_url = settings.get("mini_cash", default={}).get("base_url", default="")
mini_cash_username = settings.get("mini_cash", default={}).get("username", default="")
mini_cash_password = settings.get("mini_cash", default={}).get("password", default="")


logger = logger.bind(service="minicash", context="setup", action="setup")


class MiniCash:

    @staticmethod
    def __login() -> str:
        logger.debug("login to mini cash")
        try:
            url = mini_cash_base_url + "/Token"
            headers = {"Content-Type": "application/x-www-form-urlencoded"}
            payload = {"username": mini_cash_username, "password": mini_cash_password, "grant_type": "password"}
            response = requests.post(url, data=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                logger.debug("logged in to mini cash")
                return response.json()["access_token"]
            logger.error(
                f"failed to login to mini cash with url {url}, status code {response.status_code}, payload {payload}, and response text {response.text}"
            )
            return ""
        except Exception as expt:
            logger.error("An error occurred during minicash login: %s" % str(expt))
            return ""

    @staticmethod
    def migrateConsumer(ssn: str) -> bool:
        logger.debug("get consumer credit limit")
        mini_cash_token = MiniCash.__login()
        if mini_cash_token == "":
            return False
        try:
            url = mini_cash_base_url + "/api/Client/migrate-consumer"
            headers = {"Authorization": "Bearer " + mini_cash_token, "Content-Type": "application/json"}
            payload = {"SSN": ssn}
            response = requests.post(url, json=payload, headers=headers, timeout=180)
            if response.status_code == 200:
                return True
            else:
                logger.error("failed to migrate consumer with ssn %s" % ssn)
                logger.error("response status code %s" % response.status_code)
                logger.error("response text %s" % response.json()["Message"])
                return False

        except Exception as expt:
            logger.error("An error occurred during consumer migration: %s" % str(expt))
            return False
