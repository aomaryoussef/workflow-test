#!/usr/bin/python
import signal
import sys
import logging
from conductor.client.automator.task_handler import TaskHandler
from conductor.client.configuration.configuration import Configuration
from src.services.conductor.checkout.is_checkout_in_progress import IsCheckoutInProgress
from src.services.conductor.update_checkout_basket_loan_id import (
    UpdateCheckoutBasketLoanId,
)
from src.services.conductor.save_commercial_offers import SaveCommercialOffers
from src.services.conductor.send_order_confirmation_sms import SendOrderConfirmationSms
from src.services.conductor.update_checkout_basket_status import (
    UpdateCheckoutBasketStatus,
)
from src.services.conductor.send_checkout_otp import SendCheckoutOtp
from config.settings import settings

workflow_url = settings.get("workflow", default={}).get("base_url", default="")
debug = settings.get("log", default={}).get("level", default="INFO") == "DEBUG"


task_handler = TaskHandler(
    workers=[
        SaveCommercialOffers(),
        UpdateCheckoutBasketStatus(),
        UpdateCheckoutBasketLoanId(),
        SendOrderConfirmationSms(),
        SendCheckoutOtp(),
        IsCheckoutInProgress(),
    ],
    configuration=Configuration(
        base_url=workflow_url,
        debug=False,
        # TODO REPLACE WITH KEYS
        # authentication_settings=AuthenticationSettings(key_id=KEY_ID, key_secret=KEY_SECRET),
    ),
    scan_for_annotated_workers=True,
    import_modules=[
        "src.services.conductor.consumer.is_consumer_active",
        "src.services.conductor.partner.create_partner_admin_account",
        "src.services.conductor.partner.create_partner_admin_permission",
        "src.services.conductor.partner.create_partner_admin_profile",
        "src.services.conductor.partner.send_partner_admin_welcome_email",
        "src.services.conductor.notifications.send_slack_message",
        "src.services.conductor.returns.send_return_sms",
        "src.services.conductor.collection.send_installment_payment_notification",
        "src.services.conductor.consumer.update_mc_account_migration_status",
        "src.services.conductor.consumer.is_mini_cash_consumer",
        "src.services.conductor.consumer.get_loan_by_workflow",
        "src.services.conductor.others.get_failed_task_name_by_workflow_id",
        "src.services.conductor.checkout.get_failure_reason_by_task_name",
        "src.services.conductor.consumer.get_credit_limit",
        "src.services.conductor.consumer.update_credit_limit",
        "src.services.conductor.partner.is_partner_active",
        "src.services.conductor.checkout.select_financial_products",
        "src.services.conductor.repayment.create_formance_payment",
    ],
)


def __terminate_gracefully(_, __):
    logging.info("Recieved a termination signal, killing the app")
    task_handler.stop_processes()
    sys.exit(0)


def __check_python_version():
    supported_python = sys.version_info.major >= 3 and sys.version_info.minor >= 10
    if not supported_python:
        print("unsupported python version, minimum requirements Python 3.10.x")
        logging.critical("unsupported python version, minimum requirements Python 3.10.x")
        sys.exit(0)


if __name__ == "__main__":
    __check_python_version()
    signal.signal(signal.SIGINT, __terminate_gracefully)
    signal.signal(signal.SIGTERM, __terminate_gracefully)
    try:
        task_handler.start_processes()
        logging.info("mylo-service-department: started all workers...")
    except Exception as expt:
        logging.critical("mylo-service-department: failed to start workers - %s" % str(expt))
