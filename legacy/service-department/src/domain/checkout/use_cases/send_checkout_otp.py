from typing import Dict
from src.services.logging import logger
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerRepositoryInterface
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepositoryInterface
from src.services.echo import Echo
from src.services.sms_handler import SMSHandler

logger = logger.bind(service="checkout", context="use case", action="send checkout otp")


class SendCheckoutOtpUseCase:
    def __init__(
            self,
            consumer_repository: ConsumerRepositoryInterface,
            partner_repository: PartnerRepositoryInterface,
            checkout_otp_body: Dict[str, any],
    ):
        self.consumer_repository = consumer_repository
        self.partner_repository = partner_repository
        self.checkout_otp_body = checkout_otp_body

    def execute(self) -> str:
        logger.debug("execute")
        consumer_id = self.checkout_otp_body["consumer_id"]
        consumer = self.consumer_repository.get(consumer_id)
        if consumer is None:
            logger.error("consumer not found with id %s" % str(self.checkout_otp_body["consumer_id"]))
            raise Exception("consumer not found")
        partner = self.partner_repository.find_one(id=self.checkout_otp_body["partner_id"])
        if partner is None:
            logger.error("partner not found with id %s" % str(self.checkout_otp_body["partner_id"]))
            raise Exception("partner not found")
        try:
            otp_code = Echo.generate_otp(user_id=consumer_id, recipient=consumer.phone_number)
        except Exception as err:
            logger.error("error generating otp: {}".format(str(err)))
            raise Exception("error generating otp")
        try:
            consumer_phone_number = consumer.phone_number if consumer.phone_number.startswith(
                "+2") else "+2" + consumer.phone_number
            SMSHandler(consumer_phone_number).send_sms(
                otp_code=otp_code,
                template_type="checkout",
                total_amount=str(self.checkout_otp_body["total_amount"]),
                customer_name=consumer.full_name,
                vendor=partner.name,
                num_of_months=str(self.checkout_otp_body["num_of_months"]),
                monthly_installment=str(self.checkout_otp_body["monthly_installment"]),
                administrative_fees1=str(self.checkout_otp_body["down_payment"]),
                administrative_fees2=str(self.checkout_otp_body["admin_fee"]),
                total_fees=str(self.checkout_otp_body["total_fees"]),
                user_id=consumer_id
            )
        except Exception as e:
            logger.error("error sending otp: {}".format(str(e)))
            raise e
