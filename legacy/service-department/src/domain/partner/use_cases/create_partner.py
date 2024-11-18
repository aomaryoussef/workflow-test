import structlog
from uuid import uuid4

from src.domain.partner.dtos.create_partner_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_partner_validator import CreatePartnerInputDtoValidator
from src.domain.partner.repository.repository_partner_interface import PartnerRepositoryInterface
from src.domain.partner.models.user_profile import ProfileType, UserProfile
from src.domain.partner.models.bank_account import BankAccount
from src.domain.partner.models.partner import Partner
from src.utils.exceptions import ResourceNotCreatedException

from src.services.workflow import Workflow
from config.settings import settings

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create partner")

use_test_data = settings.get("app", default={}).get("use_test_data", default=False)


class CreatePartnerUseCase:
    """ "This class is responsible for initializing a partner."""

    def __init__(
        self,
        partner_repository: PartnerRepositoryInterface,
        input_dto: InputDto,
    ):
        self.partner_repository = partner_repository
        self.input_dto = input_dto

    def _is_duplicate_commercial_registration_number(self, commercial_registration_number: str):
        logger.debug("check for duplicate commercial registration number")
        if commercial_registration_number == "":
            return False
        result = self.partner_repository.find_by("commercial_registration_number", commercial_registration_number)
        if result is None:
            return False
        return True

    def _is_duplicate_name(self, name: str):
        logger.debug("check for duplicate partner name")
        result = self.partner_repository.find_by("name", name)
        if result is None:
            return False
        return True

    def _is_duplicate_tax_registration_number(self, tax_registration_number: str):
        logger.debug("check for duplicate tax registration number")
        result = self.partner_repository.find_by("tax_registration_number", tax_registration_number)
        if result is None:
            return False
        return True

    def execute(self) -> OutputDto:
        logger.debug("execute")
        validator = CreatePartnerInputDtoValidator(self.input_dto.to_dict())
        validator.validate()

        partner = Partner(
            name=self.input_dto.name,
            categories=self.input_dto.categories,
            tax_registration_number=self.input_dto.tax_registration_number,
            commercial_registration_number=self.input_dto.commercial_registration_number,
        )
        bank_account = BankAccount(
            partner_id=partner.id,
            bank_name=self.input_dto.bank_account.bank_name,
            branch_name=self.input_dto.bank_account.branch_name,
            beneficiary_name=self.input_dto.bank_account.beneficiary_name,
            iban=self.input_dto.bank_account.iban,
            swift_code=self.input_dto.bank_account.swift_code,
            account_number=self.input_dto.bank_account.account_number,
        )
        partner_admin_user = UserProfile(
            iam_id=uuid4(),  # this is a placeholder value to bypass validation and will never be used, the real value will be generated later
            partner_id=partner.id,
            first_name=self.input_dto.admin_user.first_name,
            last_name=self.input_dto.admin_user.last_name,
            email=self.input_dto.admin_user.email,
            phone_number=self.input_dto.admin_user.phone_number,
            profile_type=ProfileType.ADMIN,
        )

        partner.bank_accounts = [bank_account]
        partner.branches = []
        partner.user_profiles = [partner_admin_user]

        try:
            if self._is_duplicate_name(partner.name):
                raise ResourceNotCreatedException("duplicate partner name")
            is_duplicate_commercial_number = self._is_duplicate_commercial_registration_number(
                commercial_registration_number=self.input_dto.commercial_registration_number
            )
            if is_duplicate_commercial_number:
                raise ResourceNotCreatedException("duplicate commercial number")
            is_duplicate_tax_registration_number = self._is_duplicate_tax_registration_number(
                tax_registration_number=self.input_dto.tax_registration_number
            )
            if is_duplicate_tax_registration_number:
                raise ResourceNotCreatedException("duplicate tax number")
            result = self.partner_repository.create_complete_partner(partner=partner)
            Workflow.start_partner_onboarding(partner)
            if result is None:
                raise ResourceNotCreatedException("Unable to create a partner")
            output_dto = OutputDto(partner=partner)
            return output_dto
        except Exception as exception:
            raise ResourceNotCreatedException(f"Unable to create a partner with error {exception}")
