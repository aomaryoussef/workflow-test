from conductor.client.worker.worker_task import worker_task
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="get failure reason by task name")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="get_failure_reason_by_task_name", poll_interval_millis=polling_interval * 1000)
def worker_task(task_name: str) -> dict:
    logger.debug(f"task_name {task_name}")

    # map the task name to the failure reasons and return the matching one if found else return "Failure"
    failure_reasons = {
        "is_consumer_active": CheckoutBasketStatus.IN_ACTIVE_CONSUMER_FAILURE.value,
        "is_partner_active": CheckoutBasketStatus.IN_ACTIVE_PARTNER_FAILURE.value,
        "is_checkout_in_progress": CheckoutBasketStatus.IN_PROGRESS_CHECKOUT_FOUND_FAILURE.value,
        "lms_create_commercial_offers": CheckoutBasketStatus.NO_GENERATED_COMMERCIAL_OFFERS_FAILURE.value,
        "commercial_offer_selection": CheckoutBasketStatus.NO_COMMERCIAL_OFFER_SELECTED_FAILURE.value,
        "lms_activate_loan": CheckoutBasketStatus.LOAN_ACTIVATION_FAILURE.value,
        "update_credit_limit": CheckoutBasketStatus.CREDIT_LIMIT_UPDATE_FAILURE.value,
        "otp_workflow__1": CheckoutBasketStatus.OTP_FAILURE.value,
        "otp_workflow__2": CheckoutBasketStatus.OTP_FAILURE.value,
        "otp_workflow__3": CheckoutBasketStatus.OTP_FAILURE.value,
        "otp_workflow__4": CheckoutBasketStatus.OTP_FAILURE.value,
    }
    return failure_reasons.get(task_name, "FAILURE")
