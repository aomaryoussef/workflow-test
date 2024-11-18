from src.app.web.base.controller import BaseController
from src.domain.partner.database.postgresql_models import BaseDBModel
from src.app.web.partner.views.partner import PartnerViews
from src.domain.partner.dtos.create_partner_dtos import (
    InputDto,
    OutputDto,
    BankAccountDto,
    BankName,
    AdminUserDto,
)
from src.domain.partner.use_cases.create_partner import CreatePartnerUseCase
from src.services.logging import logger
from src.domain.partner.repository.postgresql_repository_partner import PartnerRepository

logger = logger.bind(service="partner", context="controller", action="create partner")


class CreatePartnerController(BaseController):
    """Init Partner Controller Class"""

    def __init__(self, json_input):
        super().__init__(BaseDB=BaseDBModel)
        self.partner_repository = PartnerRepository()
        bank_account_dto = BankAccountDto(
            bank_name=BankName[json_input["bank_account"]["bank_name"]],
            branch_name=json_input["bank_account"]["branch_name"],
            beneficiary_name=json_input["bank_account"]["beneficiary_name"],
            iban=json_input["bank_account"]["iban"],
            swift_code=(
                json_input["bank_account"]["swift_code"]
                if json_input["bank_account"].get("swift_code")
                else ''
            ),
            account_number=json_input["bank_account"]["account_number"],
        )
        admin_user_dto = AdminUserDto(
            first_name=json_input["admin_user_profile"]["first_name"],
            last_name=json_input["admin_user_profile"]["last_name"],
            phone_number=(
                json_input["admin_user_profile"]["phone_number"]
                if json_input["admin_user_profile"]["phone_number"].startswith("+2")
                else "+2" + json_input["admin_user_profile"]["phone_number"]
            ),
            email=json_input["admin_user_profile"]["email"],
        )
        self.input_dto: InputDto = InputDto(
            name=json_input["name"],
            categories=json_input["categories"],
            tax_registration_number=json_input["tax_registration_number"],
            commercial_registration_number=json_input["commercial_registration_number"],
            admin_user=admin_user_dto,
            bank_account=bank_account_dto,
        )

    def execute(self):
        """Execute the create partner controller"""
        logger.debug("execute")
        try:
            use_case = CreatePartnerUseCase(
                partner_repository=self.partner_repository,
                input_dto=self.input_dto,
            )
            output_dto: OutputDto = use_case.execute()
            result = PartnerViews.show_created(output_dto)
        except Exception as exception:
            result = PartnerViews.error(exception)
        return result
