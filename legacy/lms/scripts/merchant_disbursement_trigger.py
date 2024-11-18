#!/usr/bin/env python3
"""
This script triggers the merchant disbursement process by starting a workflow in Conductor.
The script also sends a message to a Slack channel with the start and end time of the disbursement
window together with the status of the workflow start only.

For the script to work, the following environment variables must be set:
- CONDUCTOR_API_HOST: The hostname of the Conductor server.
- CONDUCTOR_API_PORT: The port of the Conductor server. Default is 8080.
- CONDUCTOR_UI_PUBLIC_BASE_URL: The public base URL of the Conductor UI server that is reachable from public internet.
- SLACK_TOKEN: The token to authenticate with the Slack API.
- SLACK_CHANNEL_ID: The ID of the Slack channel to send the message to.

The script does the following:
1. Get the current date and time in the Africa/Cairo timezone.
2. Calculate the start and end time of the merchant disbursement process for this cycle
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

:note: This script must be triggered by a cron job at 04:10:00 Cairo Time every Sunday and Wednesday. See again:
Cairo Time and not UTC time.
"""
import os
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo
import uuid
import json
import http.client
import ssl

report_name = "Merchant Disbursement Report"
conductor_api_host = os.environ.get('CONDUCTOR_API_HOST')
conductor_api_port = os.environ.get('CONDUCTOR_API_PORT', default='8080')
conductor_ui_public_base_url = os.environ.get('CONDUCTOR_UI_PUBLIC_BASE_URL')

slack_token = os.environ.get('SLACK_TOKEN')
channel_id = os.environ.get('SLACK_CHANNEL_ID')
eod_closure_workflow_path = '/api/workflow/ga_reporting_process'
cairo = ZoneInfo("Africa/Cairo")

if conductor_api_host is None:
    raise Exception("CONDUCTOR_API_HOST environment variable is not set")
if conductor_ui_public_base_url is None:
    raise Exception("CONDUCTOR_UI_PUBLIC_BASE_URL environment variable is not set")
if slack_token is None:
    raise Exception("SLACK_TOKEN environment variable is not set")
if channel_id is None:
    raise Exception("SLACK_CHANNEL_ID environment variable is not set")


def create_slack_message(channel_id: str,
                         start_time: datetime | None,
                         end_time: datetime | None,
                         workflow_id: str | None,
                         error: Exception | None) -> dict:
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
                }
            }
        ]
    }

    if start_time is not None and end_time is not None:
        message["blocks"].append(
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"*Start Time Range:* {start_time.strftime('%Y-%m-%d %H:%M:%S %Z')}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*End Time Range:* {end_time.strftime('%Y-%m-%d %H:%M:%S %Z')}"
                    }
                ]
            }
        )

    message["blocks"].append({"type": "divider"})

    if workflow_id is not None:
        message["blocks"].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"Workflow ID: <{conductor_ui_public_base_url}/execution/{workflow_id}|{workflow_id}>"
            }
        })

    if error is not None:
        message["blocks"].append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Error:*\n ```{error}```"
            }
        })
    return message


def start_conductor_workflow(start_time: datetime, end_time: datetime) -> str:
    # start the workflow conductor
    print("Starting the workflow conductor...")
    correlation_id = str(uuid.uuid4())
    # make http post request to the conductor server
    url = f'{eod_closure_workflow_path}?correlationId={correlation_id}'

    payload = {
        "date_range_start": start_time.astimezone(cairo).isoformat(),
        "date_range_end": end_time.astimezone(cairo).isoformat()
    }

    conn = http.client.HTTPConnection(host=conductor_api_host, port=conductor_api_port)
    conn.request("POST", url, json.dumps(payload), {'Content-Type': 'application/json'})
    response = conn.getresponse()
    if response.status != 200:
        err_message = f"Failed to start the workflow conductor: {response.status}\n{response.read().decode('utf-8')}"
        raise Exception(err_message)

    new_workflow_id = response.read().decode('utf-8')
    print(f"Workflow conductor started successfully with ID: {new_workflow_id}")
    return new_workflow_id


def send_slack_message(message: dict):
    # send a message to slack
    print("Sending a message to slack...")
    url = '/api/chat.postMessage'
    headers = {
        'Authorization': f'Bearer {slack_token}',
        'Content-Type': 'application/json'
    }
    conn = http.client.HTTPSConnection(
        host="slack.com",
        context=ssl._create_unverified_context()
    )
    conn.request("POST", url, json.dumps(message), headers)
    response = conn.getresponse()
    if response.status != 200:
        err_message = f"Failed to post slack message: {response.status}\n{response.read().decode('utf-8')}"
        raise Exception(err_message)


def merchant_disbursement_process():
    # trigger the merchant disbursement process
    print("Triggering merchant disbursement process...")
    today = date.today()
    day = today.strftime("%A")
    if day == "Sunday":
        disbursement_start_date = today - timedelta(days=4)  ## Wednesday
        disbursement_end_date = today - timedelta(days=1)  ## Saturday
    elif day == "Wednesday":
        disbursement_start_date = today - timedelta(days=3)  ## Sunday
        disbursement_end_date = today - timedelta(days=1)  ## Tuesday
    else:
        exception_message = (f"Today is not a Sunday or Wednesday. Today is {day}, "
                             f"so why the hell are you running this script?\n"
                             f"Please ask the engineering team to fix the CronJob schedule.")
        message = create_slack_message(channel_id, None, None, None,
                                       Exception(exception_message))
        send_slack_message(message)
        return

    start_time = datetime(disbursement_start_date.year, disbursement_start_date.month, disbursement_start_date.day, 0,
                          0, 0, tzinfo=cairo)
    end_time = datetime(disbursement_end_date.year, disbursement_end_date.month, disbursement_end_date.day, 23, 59, 59,
                        tzinfo=cairo)
    print(f"Merchant disbursement process time range in local time: {start_time} - {end_time}")

    try:
        new_workflow_id = start_conductor_workflow(start_time=start_time, end_time=end_time)
        message = create_slack_message(channel_id, start_time, end_time, new_workflow_id, None)
        send_slack_message(message)
    except Exception as e:
        message = create_slack_message(channel_id, start_time, end_time, None, e)
        send_slack_message(message)
        raise e
    pass

merchant_disbursement_process()
