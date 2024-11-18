import structlog

from src.domain.checkout.dtos.create_checkout_basket_dto import (
    CreateCheckoutBasketInputDto,
    CreateCheckoutBasketOutputDto,
)
from src.domain.checkout.dtos.validations.create_checkout_basket_validator import (
    CreateCheckoutBasketValidator,
)
from src.domain.checkout.repository.repository_interface import (
    CheckoutBasketRepositoryInterface,
)
from src.domain.consumer.repository.repository_interface import ConsumerRepositoryInterface

from src.services.workflow import Workflow
from src.domain.checkout.models.checkout_basket import (
    CheckoutBasket,
    CheckoutBasketStatus,
)
from src.domain.lookups.models.governorate import (Governorate)
from src.domain.partner.models.partner import (Partner)
from src.domain.partner.models.branch import (Branch)

logger = structlog.get_logger()


class CreateCheckoutBasket:
    """ "This class is responsible for creating a checkout basket."""

    def __init__(
        self,
        checkout_basket_repository: CheckoutBasketRepositoryInterface,
        consumer_repository: ConsumerRepositoryInterface,
        input_dto: CreateCheckoutBasketInputDto,
        partner_details: Partner,
        branch_details: Branch,
        governorate_details: Governorate
    ):
        self.checkout_basket_repository = checkout_basket_repository
        self.consumer_repository = consumer_repository
        self.input_dto = input_dto
        self.partner_details=partner_details
        self.branch_details=branch_details
        self.governorate_details=governorate_details

    def execute(self) -> CreateCheckoutBasketOutputDto:
        logger.debug("create checkout basket use case - execute")
        validator = CreateCheckoutBasketValidator(self.input_dto.to_dict())
        validator.validate()
        basket_in_database = self.checkout_basket_repository.find_by_session_basket_id(self.input_dto.session_basket_id)

        if basket_in_database is not None:
            return CreateCheckoutBasketOutputDto(checkout_basket=basket_in_database)

        checkout_basket = CheckoutBasket(
            partner_id=self.input_dto.partner_id,
            branch_id=self.input_dto.branch_id,
            cashier_id=self.input_dto.cashier_id,
            consumer_id=self.input_dto.consumer_id,
            session_basket_id=self.input_dto.session_basket_id,
            products=self.input_dto.products,
            gross_basket_value=self.input_dto.gross_basket_value,
            consumer_device_metadata=self.input_dto.consumer_device_metadata,
            status=CheckoutBasketStatus.CREATED,
            category=self.input_dto.category,
            transaction_id=CheckoutBasket.generate_transaction_id(),
            origination_channel=self.input_dto.origination_channel,
        )
        checkout_basket = self.checkout_basket_repository.save_checkout_basket(checkout_basket)
        if checkout_basket is None:
            logger.error("Unable to create a checkout basket")
            return None
        consumer = self.consumer_repository.get(self.input_dto.consumer_id)
        workflow_id = Workflow.start_checkout(
            checkout_basket=checkout_basket,
            partner=self.partner_details,
            branch=self.branch_details,
            governorate=self.governorate_details,
            single_payment_day=consumer.single_payment_day
        )
        checkout_basket.workflow_id = workflow_id
        checkout_basket = self.checkout_basket_repository.save_checkout_basket(checkout_basket)
        return CreateCheckoutBasketOutputDto(checkout_basket=checkout_basket)
