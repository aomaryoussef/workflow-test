from src.services.echo import Echo
from src.services.logging import logger
from typing import Optional
from uuid import UUID
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface
from src.domain.checkout.repository.repository_interface import CheckoutBasketRepositoryInterface
from src.services.twilio import Twilio

logger = logger.bind(service="checkout", context="use case", action="resend checkout otp via phone call")


class ResendCheckoutOtpViaPhoneCallUseCase:
    def __init__(
            self,
            consumer_repository: ConsumerRepositoryInterface,
            checkout_repository: CheckoutBasketRepositoryInterface,
            session_basket_id: UUID,
    ):
        self.consumer_repository = consumer_repository
        self.checkout_repository = checkout_repository
        self.session_basket_id = session_basket_id

    def execute(self) -> Optional[str]:
        logger.debug("execute")

        checkout_basket = self.checkout_repository.find_by_session_basket_id(self.session_basket_id)
        offer = checkout_basket.find_commercial_offer_by_id(str(checkout_basket.selected_commercial_offer_id))
        if checkout_basket is None:
            logger.error("Checkout basket not found")
            raise Exception("Checkout basket not found")
        consumer_id = checkout_basket.consumer_id
        consumer = self.consumer_repository.get(consumer_id)
        if consumer is None:
            logger.error("consumer not found")
            raise Exception("consumer not found")
        try:
            tenure_duration = offer["tenure"].split("_")[0]

            otp_code = Echo.generate_otp(user_id=str(consumer_id), recipient=consumer.phone_number)

            down_payment = offer["down_payment"]["units"] / 100,
            admin_fees = offer["admin_fee"]["units"] / 100,

            parameters = {
                "monthly_installment": offer["monthly_instalment"]["units"] / 100,
                "tenure_duration": tenure_duration,
                "down_payment": down_payment,
                "total_amount": offer["total_amount"]["units"] / 100,
                "admin_fees": admin_fees,
                "total_amount_to_pay": down_payment + admin_fees,
                "unit": "شهر" if int(tenure_duration) > 9 else "شهور",
            }

            Twilio().trigger_voice_call(
                otp_type="checkout",
                to_phone_number=consumer.phone_number,
                otp_code=otp_code,
                payload=parameters
            )
            return consumer.phone_number
        except Exception as err:
            logger.error(f"error sending voice: {err}")
            raise err
