from conductor.client.worker.worker_task import worker_task
from src.domain.partner.repository.postgresql_repository_bank_account import BankAccountRepository
from src.domain.partner.use_cases.create_partner_bank_account import CreatePartnerBankAccountUseCase
from src.domain.partner.models.bank_account import BankName
from src.domain.partner.dtos.create_partner_bank_account_dtos import InputDto, OutputDto
from src.services.logging import logger
from config.settings import settings

logger = logger.bind(service="conductor", context="worker", action="create partner bank account")
polling_interval = settings.get("workflow", default={}).get("polling_interval")


@worker_task(task_definition_name="create_partner_bank_account", poll_interval_millis=polling_interval * 1000)
def create_partner_bank_account(
    partner_id: str,
    bank_name: str,
    branch_name: str,
    beneficiary_name: str,
    iban: str,
    swift_code: str,
    account_number: str,
) -> dict:
    logger.info("worker started")
    logger.debug(
        f"partner_id {partner_id}, bank_name {bank_name}, branch_name {branch_name}, beneficiary_name {beneficiary_name}, "
        + f"iban {iban}, swift_code {swift_code}, account_number {account_number}"
    )
    input_dto = InputDto(
        partner_id=partner_id,
        bank_name=BankName[bank_name],
        branch_name=branch_name,
        beneficiary_name=beneficiary_name,
        iban=iban,
        swift_code=swift_code,
        account_number=account_number,
    )
    repository = BankAccountRepository()

    use_case = CreatePartnerBankAccountUseCase(bank_account_repository=repository, input_dto=input_dto)
    logger.info("use case created")
    output_dto: OutputDto = use_case.execute()
    logger.info("use case executed")
    return output_dto.to_dict()
