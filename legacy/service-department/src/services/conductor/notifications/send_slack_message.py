from conductor.client.worker.worker_task import worker_task
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="send slack message")
enable_slack = settings.get("slack", default={}).get("enable", default=False)
slack_token = settings.get("slack", default={}).get("token", default="")
channel_id = settings.get("slack", default={}).get("channel_id", default="")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="send_slack_message", poll_interval_millis=polling_interval * 1000)
def worker_task(message: str) -> dict:
    logger.debug(f"message {message}")
    if not enable_slack:
        # This check is added so that this task doesn't fail if slack is not enabled.
        return "slack sending not enabled"
    client = WebClient(token=slack_token)
    try:
        response = client.chat_postMessage(channel=channel_id, text=message)
        return response.data
    except SlackApiError as e:
        raise Exception(
            f"Received a response status_code: {e.response.status_code} with an error: {e.response['error']}"
        )
