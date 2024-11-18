import structlog

from src.domain.partner.dtos.create_partner_bank_account_dtos import InputDto, OutputDto
from src.domain.partner.dtos.validations.create_partner_bank_account_validator import (
    CreatePartnerBankAccountInputDtoValidator,
)
from src.domain.partner.repository.repository_bank_account_interface import BankAccountRepositoryInterface
from src.utils.exceptions import ResourceNotCreatedException

logger = structlog.get_logger()
logger = logger.bind(service="partner", context="use case", action="create partner bank account")


class CreatePartnerBankAccountUseCase:
    def __init__(
        self,
        bank_account_repository: BankAccountRepositoryInterface,
        input_dto: InputDto,
    ):
        self.bank_account_repository = bank_account_repository
        self.input_dto = InputDto

    def execute(self) -> OutputDto:
        logger.debug("execute")
        validator = CreatePartnerBankAccountInputDtoValidator(self.input_dto.to_dict())
        validator.validate()

        bank_account = self.bank_account_repository.create(
            partner_id=self.input_dto.partner_id,
            bank_name=self.input_dto.bank_name,
            branch_name=self.input_dto.branch_name,
            beneficiary_name=self.input_dto.beneficiary_name,
            iban=self.input_dto.iban,
            swift_code=self.input_dto.swift_code,
            account_number=self.input_dto.account_number,
        )
        if bank_account is None:
            raise ResourceNotCreatedException("Unable to create a partner account")

        output_dto = OutputDto(bank_account=bank_account)
        return output_dto
