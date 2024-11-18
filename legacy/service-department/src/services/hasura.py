import requests
import json
from datetime import datetime
from config.settings import settings
from src.services.logging import logger

hasura_base_url = settings.get("hasura", default={}).get("base_url", default="")


logger = logger.bind(service="hasura", context="setup", action="setup")


class Hasura:
    @staticmethod
    def fetch_due_payments_info(target_date: str = None):
        logger.debug(f"fetch_due_payments_info for date: {target_date}")
        if target_date is None:
            logger.debug("No target date provided, defaulting to today")
            target_date = datetime.now().strftime("%Y-%m-%d")
        try:
            # Provide a GraphQL query
            query = f"""
                query FetchDuePayments {{
                    loan_schedule(where: {{paid_date: {{_is_null: true}},
                    due_date: {{_gte: "{target_date}T00:00:00+00:00", _lte: "{target_date}T23:59:59+00:00"}},
                    is_cancelled: {{_eq: false}}
                    }}) {{
                        due_date
                        created_at
                        due_interest
                        due_late_fee
                        due_principal
                        grace_period_end_date
                        loan_balance
                        paid_date
                        paid_interest
                        paid_late_fee
                        paid_principal
                        loan {{
                            consumer {{
                                full_name
                                phone_number
                            }}
                        }}
                    }}
                }}
            """

            # Execute the query on the transport
            response = requests.post(
                hasura_base_url, headers={"Content-Type": "application/json"}, data=json.dumps({"query": query})
            )

            if response.status_code == 200:
                result = response.json()
                return result["data"]["loan_schedule"]
            else:
                logger.error(f"GraphQL query failed with status {response.status_code}, {response.text}")
                return {}
        except Exception as exception:
            logger.error("An error occurred: %s" % str(exception))
            return {}

    # add a method called execute_query that takes a graphql query with optional variables and returns the result
    @staticmethod
    def execute_query(query: str, variables: dict = None):
        logger.debug(f"execute_query with query: {query}")
        try:
            # Execute the query on the transport
            response = requests.post(
                hasura_base_url,
                headers={"Content-Type": "application/json"},
                data=json.dumps({"query": query, "variables": variables}),
            )

            if response.status_code == 200:
                result = response.json()
                return result
            else:
                logger.error(f"GraphQL query failed with status {response.status_code}, {response.text}")
                return {}
        except Exception as exception:
            logger.error("An error occurred: %s" % str(exception))
            return {}
