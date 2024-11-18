from ulid import ULID
from src.services.logging import logger
from src.services.workflow import Workflow
from src.utils.exceptions import ResourceNotCreatedException
from src.domain.registry.repository.payment_repo_interface import PaymentRepoInterface
from src.domain.registry.dtos.create_payment_dtos import InputDto, OutputDto
from src.domain.registry.models.payment import Payment

logger = logger.bind(service="registry", context="use case", action="create payment")


class CreatePaymentUseCase:
    def __init__(self, repository: PaymentRepoInterface, input_dto: InputDto):
        self.repository = repository
        self.input_dto = input_dto

    def execute(self) -> OutputDto:
        logger.debug("execute")

        # 1. Validate the incoming request # TODO
        # 2. Using the x-request-id header, ensure this is not being replayed # TODO
        # 3. Using the Billing Account, ensure this is not a duplicate payment
        existing_payments = self.repository.find_all(
            billing_account=self.input_dto.billing_account,
            billing_account_schedule_id=self.input_dto.billing_account_schedule_id,
        )
        if len(existing_payments) > 0:
            logger.error(
                f"Payment for billing account {self.input_dto.billing_account} and billing account schedule"
                + f" id {self.input_dto.billing_account_schedule_id} already exists"
            )
            raise ResourceNotCreatedException(
                f"Payment for billing account {self.input_dto.billing_account} and billing account schedule"
                + f" id {self.input_dto.billing_account_schedule_id} already exists"
            )

        # 4. Create a Payment Entity
        payment_id = ULID() if self.input_dto.id is None else self.input_dto.id
        payment = Payment(
            id=payment_id,
            channel=self.input_dto.channel,
            channel_reference_id=self.input_dto.channel_reference_id,
            channel_transaction_id=self.input_dto.channel_transaction_id,
            payee_id=self.input_dto.payee_id,
            payee_type=self.input_dto.payee_type,
            payee_id_type=self.input_dto.payee_id_type,
            billing_account=self.input_dto.billing_account,
            billing_account_schedule_id=self.input_dto.billing_account_schedule_id,
            amount_units=self.input_dto.amount_units,
            raw_request=self.input_dto.raw_request,
            created_by=self.input_dto.created_by,
            booking_time=self.input_dto.booking_time,
        )
        # 5. Save the record in a transaction
        created_payment = self.repository.create(payment=payment, callback=Workflow.start_consumer_collection)
        if created_payment is None:
            logger.error("Unable to save payment record")
            raise ResourceNotCreatedException("Unable to save payment record")
        else:
            logger.debug("Payment registered successfully with id {}".format(created_payment.id))
            output_dto: OutputDto = OutputDto(payment=created_payment)
            return output_dto
