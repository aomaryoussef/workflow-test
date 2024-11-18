from uuid import UUID
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.bank_account import BankName, BankAccount


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner_id: UUID
    bank_name: BankName
    branch_name: str
    beneficiary_name: str
    iban: str
    swift_code: str
    account_number: str


@dataclass
class OutputDto(BaseOutputDto):
    bank_account: BankAccount

    def to_dict(self):
        result = asdict(self.bank_account, dict_factory=asdict_factory)
        return result
