from src.app.web.base.controller import BaseController
from src.domain.checkout.database.postgresql_models import BaseDBModel
from src.app.web.checkout.views.checkout_basket import CreateCheckoutBasketView
from src.domain.partner.dtos.retrieve_partner_dtos import (
    InputDto as RetrievePartnerInputDto,
    OutputDto as RetrievePartnerOutputDto,
)
from src.domain.checkout.dtos.create_checkout_basket_dto import (
    CreateCheckoutBasketInputDto,
)
from src.domain.checkout.use_cases.create_checkout_basket import (
    CreateCheckoutBasket,
)
from src.domain.partner.use_cases.retrieve_partner import (
    RetrievePartnerUseCase,
)
from src.services.logging import logger
from src.domain.checkout.repository.postgresql_repository_checkout_basket import (
    CheckoutBasketPostgresqlRepository,
)
from src.domain.consumer.repository.postgresql_repository_consumer import ConsumerPostgresqlRepository
from src.domain.partner.repository.postgresql_repository_partner import (
    PartnerRepository,
)
from src.domain.lookups.repository.postgresql_repository_governorate import (GovernorateRepository, )
from src.domain.lookups.use_cases.retrieve_governorate import (
    RetrieveGovernorateCase,
)
from src.domain.lookups.dtos.retrieve_governorate_dtos import (
    OutputDto as RetrieveGovernorateOutputDto,
)

logger = logger.bind(service="checkout", context="controller", action="create checkout basket")


class CreateCheckoutBasketController(BaseController):
    def __init__(self, checkout_basket):
        super().__init__(BaseDB=BaseDBModel)
        self.input_dto: CreateCheckoutBasketInputDto
        self.json_input = checkout_basket
        self.checkout_basket_repository = CheckoutBasketPostgresqlRepository()
        self.consumer_repository = ConsumerPostgresqlRepository()
        self.partner_repository = PartnerRepository()
        self.governorate_repository = GovernorateRepository()

    def execute(self):
        logger.debug("execute")
        try:
            if not ("partner_id" in self.json_input):
                raise ValueError("Missing partner_id")

            if not ("cashier_id" in self.json_input):
                raise ValueError("Missing cashier_id")

            if not ("cashier_id" in self.json_input):
                raise ValueError("Missing cashier_id")

            if not ("branch_id" in self.json_input):
                raise ValueError("Missing branch_id")

            if not ("consumer_id" in self.json_input):
                raise ValueError("Missing consumer_id")

            if not ("session_basket_id" in self.json_input):
                raise ValueError("Missing session_basket_id")

            if not ("products" in self.json_input):
                raise ValueError("Missing products")

            if not ("gross_basket_value" in self.json_input):
                raise ValueError("Missing gross_basket_value")

            retrieve_partner_input_dto = RetrievePartnerInputDto(id=self.json_input["partner_id"])
            retrieve_partner_output_dto: RetrievePartnerOutputDto = RetrievePartnerUseCase(
                repository=self.partner_repository, input_dto=retrieve_partner_input_dto
            ).execute()
            self.get_governorate = RetrieveGovernorateOutputDto(governorates= None) 
            if retrieve_partner_output_dto is not None:
                self.category = str(retrieve_partner_output_dto.partner.categories[0].value)

                self.branch =  next(
                    (
                        branch
                        for branch in retrieve_partner_output_dto.partner.branches
                        if str(branch.id) == str(self.json_input["branch_id"])
                    ),
                    None,
                )
                if self.branch is not None:
                    self.get_governorate = RetrieveGovernorateCase(
                    repository=self.governorate_repository, id=self.branch.governorate_id
                    ).execute()

            self.input_dto = CreateCheckoutBasketInputDto(
                partner_id=self.json_input["partner_id"],
                cashier_id=self.json_input["cashier_id"],
                branch_id=self.json_input["branch_id"],
                consumer_id=self.json_input["consumer_id"],
                session_basket_id=self.json_input["session_basket_id"],
                products=self.json_input["products"],
                consumer_device_metadata=self.json_input["consumer_device_metadata"],
                gross_basket_value=self.json_input["gross_basket_value"],
                category=self.category,
                origination_channel=self.json_input.get("origination_channel", ""),
            )
            self.input_dto.products[0]["category"] = self.category
            output_dto = CreateCheckoutBasket(
                checkout_basket_repository=self.checkout_basket_repository,
                consumer_repository=self.consumer_repository,
                input_dto=self.input_dto,
                partner_details=retrieve_partner_output_dto.partner,
                branch_details=self.branch,
                governorate_details=self.get_governorate.governorates
            ).execute()
            result = CreateCheckoutBasketView.show(output_dto)
        except Exception as exception:
            logger.error("Failed to create checkout basket %s" % str(exception))
            result = CreateCheckoutBasketView.show_error(exception)
        return result
