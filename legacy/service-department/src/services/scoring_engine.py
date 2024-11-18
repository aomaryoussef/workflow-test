import requests
from dataclasses import dataclass
from config.settings import settings
from src.services.logging import logger
from src.utils.exceptions import (
    ResourceNotUpdatedException,
    ConflictException,
    ServiceUnAvailableException,
    FailedToProcessRequestException,
)

scoring_engine_base_url = settings.get("scoring_engine", default={}).get("base_url", default="")
scoring_engine_token = settings.get("scoring_engine", default={}).get("token", default="")


logger = logger.bind(service="scoring engine", context="setup", action="setup")


@dataclass()
class ScoringEngineCreditLimitResponse:
    user_exists: bool
    credit_limit: int
    classification: str
    status: str
    creation_date: str


class ScoringEngine:
    @staticmethod
    def getConsumerCreditLimit(phone_number: str, ssn: str = None) -> ScoringEngineCreditLimitResponse:
        method_logger = logger.bind(action="getConsumerCreditLimit")
        method_logger.debug("execute")
        method_logger.debug(f"phone_number: {phone_number}, ssn: {ssn}")
        phone_number = phone_number[2:] if phone_number.startswith("+2") else phone_number
        url = scoring_engine_base_url + "/graphql"
        body = ""
        if ssn:
            body = f"""
            {{
                getCreditLimitQuery: getCreditLimitBySSN(body: {{ ssn: "{ssn}" }}) {{
                    userExists
                    creditLimit
                    classification
                    creationDate
                    status
                }}
            }}
            """
        else:
            body = f"""
                {{
                    getCreditLimitQuery: getCreditLimit(body: {{ mobileNumber: "{phone_number}" }}) {{
                        userExists
                        creditLimit
                        classification
                        creationDate
                        status
                    }}
                }}
                """
        token = "Bearer " + str(scoring_engine_token)
        response = requests.post(url, json={"query": body}, headers={"Authorization": token}, timeout=120)
        method_logger.debug(response)

        if response.status_code == 200:
            data = response.json().get("data")
            errors = response.json().get("errors")
            if data is not None:
                credit_limit_data = data.get("getCreditLimitQuery")
                user_exists = credit_limit_data.get("userExists", False)
                credit_limit = credit_limit_data.get("creditLimit", 0)
                classification = credit_limit_data.get("classification", "NA")
                status = credit_limit_data.get("status", None)
                creation_date = credit_limit_data.get("creationDate", None)
                return ScoringEngineCreditLimitResponse(user_exists, credit_limit, classification, status, creation_date)
            else:
                method_logger.error(f"error in scoring engine response {errors}")
                if len(errors) > 0:
                    error_message = errors[0].get("message")
                    if error_message.split(":")[0] == "9 FAILED_PRECONDITION" or error_message.split(":")[3] == " 409":
                        error_message = "multiple users found with the same phone number"
                        method_logger.error(error_message)
                        raise ConflictException(error_message)
                    else:
                        method_logger.error(error_message)
                        raise FailedToProcessRequestException(error_message)
        else:
            raise ServiceUnAvailableException("scoring engine service is unavailable")

    @staticmethod
    def updateConsumerCreditLimit(ssn: str, amount: int, monthly_used_credit: int = 0) -> dict:
        logger.debug(f"update consumer credit limit with {amount}")
        try:
            url = scoring_engine_base_url + "/graphql"
            query = """
                mutation($body: UpdateMyloCreditLimitInput!) {
                    updateMyloCreditLimit(body: $body) {
                        status
                        failure_reason
                        credit_limit
                    }
                }
            """
            # Construct the payload of the previous mutation
            payload = {
                "query": query,
                "variables": {
                    "body": {
                        "ssn": ssn,
                        "used_credit": amount,
                        "monthly_used_credit": monthly_used_credit,
                    }
                },
            }
            # Make a post request to the scoring engine
            response = requests.post(
                url,
                json=payload,  # Use 'json' instead of 'data' to ensure JSON serialization
                headers={
                    "Authorization": f"Bearer {scoring_engine_token}",
                    "Content-Type": "application/json",
                },
                timeout=30,
            )
            logger.debug("response %s" % str(response.json()))
            if response.status_code == 200:
                logger.debug(f"response {response.json()['data']['updateMyloCreditLimit']}")
                return response.json()["data"]["updateMyloCreditLimit"]
            else:

                logger.error("GraphQL query failed with status %s, %s" % (response.status_code, response.text))
            raise ResourceNotUpdatedException("error updating credit limit")
        except Exception as e:
            logger.error("An error occurred: %s" % str(e))
            raise ServiceUnAvailableException("scoring engine service is unavailable")