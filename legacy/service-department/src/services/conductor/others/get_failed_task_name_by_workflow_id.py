from conductor.client.worker.worker_task import worker_task
from conductor.client.http.api_client import ApiClient
from conductor.client.http.api.workflow_resource_api import WorkflowResourceApi
from conductor.client.configuration.configuration import Configuration
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="get failed task name by workflow id")
workflow_base_url = settings.get("workflow", default={}).get("base_url", default="")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="get_failed_task_name_by_workflow_id", poll_interval_millis=polling_interval * 1000)
def worker_task(workflow_id: str) -> dict:
    logger.debug(f"workflow_id {workflow_id}")

    configuration = Configuration(base_url=workflow_base_url)
    api_client = ApiClient(configuration)
    workflowResourceApi = WorkflowResourceApi(api_client)
    workflow = workflowResourceApi.get_execution_status(workflow_id)

    if len(workflow.failed_reference_task_names) == 0:
        return {}
    else:
        return workflow.failed_reference_task_names[0]
