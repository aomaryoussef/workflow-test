#!/usr/bin/env python3
"""
This script triggers the End of Day (EOD) closure process by starting a workflow in Conductor.
The script also sends a message to a Slack channel with the start and end time of the closure
process together with the status of the workflow start only.

For the script to work, the following environment variables must be set:
- CONDUCTOR_API_HOST: The hostname of the Conductor server.
- CONDUCTOR_API_PORT: The port of the Conductor server. Default is 8080.
- CONDUCTOR_UI_PUBLIC_BASE_URL: The public base URL of the Conductor UI server that is reachable from public internet.
- SLACK_TOKEN: The token to authenticate with the Slack API.
- SLACK_CHANNEL_ID: The ID of the Slack channel to send the message to.

The script does the following:
1. Get the current date and time in the Africa/Cairo timezone.
2. Calculate the start and end time of the EOD closure process for the previous day.
3. Start a workflow in Conductor with the start and end time as input parameters.
4. Send a message to a Slack channel with the start and end time of the closure process and the
status of the workflow start.

If the workflow start fails, the script sends an error message to the Slack channel.

For DevOps:
The Slack Channel ID is:
- C06Q2U5999P for DEV, Staging
- C06PQ3PD4QK for Production

The SLACK_TOKEN must be a secret only, everything else must be configured in plain text
in the Helm chart values.yaml file.

:note: This script must be triggered by a cron job at 00:10:00 Cairo Time every day. See again:
Cairo Time and not UTC time.
"""
import os
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
import uuid
import json
import http.client

report_name = "End of Day Closure Process Report"
conductor_api_host = os.environ.get("CONDUCTOR_API_HOST")
conductor_api_port = os.environ.get("CONDUCTOR_API_PORT", default="8080")
conductor_ui_public_base_url = os.environ.get("CONDUCTOR_UI_PUBLIC_BASE_URL")

slack_token = os.environ.get("SLACK_TOKEN")
channel_id = os.environ.get("SLACK_CHANNEL_ID")
eod_closure_workflow_path = "/api/workflow/end_of_day_closing"
cairo = ZoneInfo("Africa/Cairo")

if conductor_api_host is None:
    raise Exception("CONDUCTOR_API_HOST environment variable is not set")
if conductor_ui_public_base_url is None:
    raise Exception("CONDUCTOR_UI_PUBLIC_BASE_URL environment variable is not set")
if slack_token is None:
    raise Exception("SLACK_TOKEN environment variable is not set")
if channel_id is None:
    raise Exception("SLACK_CHANNEL_ID environment variable is not set")


def get_yesterday_date() -> date:
    # get the current date in RFC3339 format
    print("Getting the current date...")
    current_date = datetime.now()
    # get the current date
    current_date = current_date.date()
    # get the previous day
    yesterday = current_date - timedelta(days=1)
    return yesterday


def get_yesterday_date() -> date:
    # get the current date in RFC3339 format and account for months that have 30 and 31 days
    print("Getting the current date...")
    today = date.today()
    if today.day == 1:
        if today.month == 1:
            yesterday = today.replace(year=today.year - 1, month=12, day=31)
        else:
            yesterday = today.replace(month=today.month - 1, day=31)
    else:
        yesterday = today.replace(day=today.day - 1)
    return yesterday


def create_slack_message(
    channel_id: str, start_time: datetime, end_time: datetime, workflow_id: str | None, error: Exception | None
) -> dict:
    # create a message to send to slack
    if error is not None:
        title = f":warning: {report_name}"
    else:
        title = f":tada: {report_name}"

    message = {
        "channel": channel_id,
        "blocks": [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": title,
                },
            },
            {
                "type": "context",
                "elements": [
                    {"type": "mrkdwn", "text": f"*Start Time Range:* {start_time.strftime('%Y-%m-%d %H:%M:%S %Z')}"},
                    {"type": "mrkdwn", "text": f"*End Time Range:* {end_time.strftime('%Y-%m-%d %H:%M:%S %Z')}"},
                ],
            },
            {"type": "divider"},
        ],
    }

    if workflow_id is not None:
        message["blocks"].append(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"Workflow ID: <{conductor_ui_public_base_url}/execution/{workflow_id}|{workflow_id}>",
                },
            }
        )

    if error is not None:
        message["blocks"].append({"type": "section", "text": {"type": "mrkdwn", "text": f"*Error:*\n ```{error}```"}})
    return message


def start_conductor_workflow(start_time: datetime, end_time: datetime) -> str:
    # start the workflow conductor
    print("Starting the workflow conductor...")
    correlation_id = str(uuid.uuid4())
    # make http post request to the conductor server
    url = f"{eod_closure_workflow_path}?correlationId={correlation_id}"

    payload = {
        "date_range_start": start_time.astimezone(cairo).isoformat(),
        "date_range_end": end_time.astimezone(cairo).isoformat(),
    }

    conn = http.client.HTTPConnection(host=conductor_api_host, port=conductor_api_port)
    conn.request("POST", url, json.dumps(payload), {"Content-Type": "application/json"})
    response = conn.getresponse()
    if response.status != 200:
        err_message = f"Failed to start the workflow conductor: {response.status}\n{response.read().decode('utf-8')}"
        raise Exception(err_message)

    new_workflow_id = response.read().decode("utf-8")
    print(f"Workflow conductor started successfully with ID: {new_workflow_id}")
    return new_workflow_id


def send_slack_message(message: dict):
    # send a message to slack
    print("Sending a message to slack...")
    url = "/api/chat.postMessage"
    headers = {"Authorization": f"Bearer {slack_token}", "Content-Type": "application/json"}
    conn = http.client.HTTPSConnection(host="slack.com")
    conn.request("POST", url, json.dumps(message), headers)
    response = conn.getresponse()
    if response.status != 200:
        err_message = f"Failed to post slack message: {response.status}\n{response.read().decode('utf-8')}"
        raise Exception(err_message)


def trigger_eod():
    # trigger the EOD closure process
    print("Triggering EOD closure process...")
    yesterday = get_yesterday_date()
    start_time = datetime(yesterday.year, yesterday.month, yesterday.day, 0, 0, 0, tzinfo=cairo)
    end_time = datetime(yesterday.year, yesterday.month, yesterday.day, 23, 59, 59, tzinfo=cairo)
    print(f"Closure process time range in local time: {start_time} - {end_time}")

    try:
        new_workflow_id = start_conductor_workflow(start_time=start_time, end_time=end_time)
        message = create_slack_message(channel_id, start_time, end_time, new_workflow_id, None)
        send_slack_message(message)
    except Exception as e:
        message = create_slack_message(channel_id, start_time, end_time, None, e)
        send_slack_message(message)
        raise e
    pass


trigger_eod()
