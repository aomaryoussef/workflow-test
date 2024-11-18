from conductor.client.worker.worker_task import worker_task
from conductor.client.worker.exception import NonRetryableException
from src.services.hasura import Hasura
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="get loan by workflow id")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="get_loan_by_workflow", poll_interval_millis=polling_interval * 1000)
def worker_task(workflow_id: str) -> dict:
    logger.debug(f"workflow_id {workflow_id}")
    # check if the workflow_id is valid
    if not workflow_id:
        raise NonRetryableException("workflow_id is required")
    query = f"""
        query GetLoanQuery {{
            loan(where: {{correlation_id: {{_eq: "{workflow_id}"}}}}) {{
                id
                new_loan_id
                merchant_global_id
                financial_product_version
                financial_product_key
                created_by
                created_at
                correlation_id
                consumer_id
                commercial_offer_id
                booked_at
            }}
        }}
    """
    result = Hasura.execute_query(query)
    response = result["data"]["loan"][0] if result["data"]["loan"] else {}
    return response
