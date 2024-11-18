from datetime import datetime

import requests
import json
from config.config import LMS2_BASE_URL, MIGRATION_SCRIPT
from .models import Loan
import util.logger as logger

def create_loan_lms_v2(loan: Loan):
    url = f"{LMS2_BASE_URL}/loan-accounts"
    # Define the request body
    payload = {
        "loan_id": loan.id,
        "financial_product_key": f"{loan.financial_product_key}-{loan.financial_product_version}",
        "financial_product_tenor_key": loan.tenor_key,
        "borrower": {
            "borrower_id": loan.consumer_id,
            "repayment_day_of_month": loan.consumer_repayment_day_of_month,
        },
        "booking_time_utc": loan.booked_at.isoformat(),
        "commercial_offer_id": loan.commercial_offer_id,
        "lender_source": "mylo",
        "origination_amount": {
            "currency": "EGP",
            "amount": loan.origination_amount
        },
        "down_payment": {
            "currency": "EGP",
            "amount": loan.down_payment_amount
        },
        "vat_collection_type": "collected_by_merchant",
        "service_fee_collection_type": "collected_by_merchant",
        "merchant_id": loan.merchant_global_id,
        "merchant_code": loan.merchant_code,
        "origination_channel": "mylo"
    }


    # Set the headers
    headers = {
        'Content-Type': 'application/json',
        'X-User-Id': MIGRATION_SCRIPT,
    }

    # Send the POST request
    response = requests.post(url, headers=headers, data=json.dumps(payload))

    if response.status_code != 202:
        err_msg = f"failed to create loan: {loan.id} with response code: {response.status_code}"
        logger.error(f"{err_msg} - {response.json()}")
        raise Exception(err_msg)

def activate_loan_lms_v2(loan: Loan):
    url = f"{LMS2_BASE_URL}/loan-accounts/{loan.id}/activate"
    # Define the request body
    payload = {
        "activated_at_utc": loan.booked_at.isoformat(),
    }
    # Set the headers
    headers = {
        "Content-Type": 'application/json',
        "X-User-Id": MIGRATION_SCRIPT,
        "If-Match": "1",
    }

    try:
        # Send the PUT request
        response = requests.put(url, headers=headers, data=json.dumps(payload))
        if response.status_code != 202:
            err_msg = f"failed to activate loan: {loan.id} with response code: {response.status_code}"
            logger.error(f"{err_msg} - {response.json()}")
            raise Exception(err_msg)
    except Exception as e:
        err_msg = f"failed to activate loan: {loan.id}"
        logger.error(f"{err_msg} - {e}")
        raise Exception(err_msg)

def cancel_loan_lms_v2(loan_id: str, cancelled_at_utc: datetime):
    url = f"{LMS2_BASE_URL}/loan-accounts/{loan_id}/cancel"
    # Define the request body
    payload = {
        "cancelled_at_utc": cancelled_at_utc.isoformat(),
        "return_policy_days": 365 ## Hard-coding the return policy to be 1 year to be able to cancel the loans. This is new feature in V2. See OpenAPI Spec.
    }
    # Set the headers
    headers = {
        "Content-Type": 'application/json',
        "X-User-Id": MIGRATION_SCRIPT,
        "If-Match": "2", ## Hard-coded because we created and activated the loan making its version at 2
    }

    try:
        # Send the PUT request
        response = requests.put(url, headers=headers, data=json.dumps(payload))
        if response.status_code != 202:
            err_msg = f"failed to cancel loan: {loan_id} with response code: {response.status_code}"
            logger.error(f"{err_msg} - {response.json()}")
            raise Exception(err_msg)
    except Exception as e:
        err_msg = f"failed to cancel loan: {loan_id}"
        logger.error(f"{err_msg} - {e}")
        raise Exception(err_msg)