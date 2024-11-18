from uuid import UUID
from src.services.logging import logger

from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerRepositoryInterface
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepositoryInterface
from src.domain.checkout.models.checkout_basket import CheckoutBasket
from config.settings import settings
from src.utils.notifications import Notifications

logger = logger.bind(service="checkout", context="use case", action="send confirmation sms")

order_confirmation_sms_template_id = settings.get("sms_templates", default={}).get("order_confirmation", default="")


class SendConfirmationSmsUseCase:
    def __init__(
        self,
        checkout_basket_repository: CheckoutBasketRepositoryInterface,
        consumer_repository: ConsumerRepositoryInterface,
        partner_repository: PartnerRepositoryInterface,
        workflow_id: UUID,
    ):
        self.checkout_basket_repository = checkout_basket_repository
        self.consumer_repository = consumer_repository
        self.partner_repository = partner_repository
        self.workflow_id = workflow_id

    def execute(self) -> str:
        logger.debug("execute")
        checkout_basket = self.checkout_basket_repository.find_by_workflow_id(self.workflow_id)
        self.notify_consumer(checkout_basket)

    def notify_consumer(self, checkout_basket: CheckoutBasket):
        offer = checkout_basket.find_commercial_offer_by_id(str(checkout_basket.selected_commercial_offer_id))
        consumer = self.consumer_repository.get(checkout_basket.consumer_id)
        partner = self.partner_repository.find_one(id=checkout_basket.partner_id)
        if consumer is None:
            logger.error("consumer not found with id %s" % str(checkout_basket.consumer_id))
            raise Exception("consumer not found")
        if partner is None:
            logger.error("partner not found with id %s" % str(checkout_basket.partner_id))
            raise Exception("partner not found")

        try:
            tenure_duration = offer["tenure"].split("_")[0]
            Notifications.send_sms(
                order_confirmation_sms_template_id,
                consumer.phone_number,
                merchant_name=partner.name,
                consumer_name=consumer.full_name,
                monthly_installment=offer["monthly_instalment"]["units"] / 100,
                tenure_duration=tenure_duration,
                down_payment=offer["down_payment"]["units"] / 100,
                total_amount=offer["total_amount"]["units"] / 100,
                admin_fees=offer["admin_fee"]["units"] / 100,
                unit="شهر" if int(tenure_duration) > 9 else "شهور",
            )
        except Exception as e:
            logger.error("error sending sms: {}".format(str(e)))
            raise e
