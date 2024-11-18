from conductor.client.worker.worker_task import worker_task
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository
from src.domain.checkout.repository.postgresql_repository_checkout_basket import CheckoutBasketPostgresqlRepository
from src.utils.exceptions import NotFoundException
from src.services.logging import logger
from config.settings import settings
from src.utils.notifications import Notifications


logger = logger.bind(service="conductor", context="worker", action="send return sms")
return_product_sms_template_id = settings.get("sms_templates", default={}).get("return_product", default="")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="send_return_sms", poll_interval_millis=polling_interval * 1000)
def worker_task(loan_id: str) -> dict:
    logger.info("worker started")
    logger.debug("loan_id %s" % loan_id)

    checkout_basket_repository = CheckoutBasketPostgresqlRepository()
    checkout_basket = checkout_basket_repository.find_by_loan_id(loan_id)
    if checkout_basket is None:
        raise NotFoundException("checkout basket not found")

    consumer_repository = ConsumerPostgresqlRepository()
    consumer = consumer_repository.get(checkout_basket.consumer_id)
    if consumer is None:
        raise NotFoundException("consumer not found")

    partner_repository = PartnerRepository()
    partner = partner_repository.find_one(id=checkout_basket.partner_id)
    if partner is None:
        raise NotFoundException("partner not found")

    offer = checkout_basket.find_commercial_offer_by_id(str(checkout_basket.selected_commercial_offer_id))
    return_amount = offer["down_payment"]["units"] / 100 + offer["admin_fee"]["units"] / 100

    sms_response = Notifications.send_sms(
        return_product_sms_template_id,
        consumer.phone_number,
        merchant_name=partner.name,
        return_amount=str(return_amount),
    )
    return sms_response
