from uuid import UUID
from typing import Optional
from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.models.bank_account import BankName
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner_id: UUID
    transaction_id: UUID


@dataclass
class OutputDto(BaseOutputDto):
    consumer_id: str
    transaction_id: str
    transaction_date: str
    workflow_id: str
    loan_id: Optional[str] = None
    cashier_name: Optional[str] = None
    name: Optional[str] = None
    status: Optional[str] = None
    amount_financed: Optional[float] = 0
    down_payment: Optional[float] = 0
    admin_fees: Optional[float] = 0
    amount_collected: Optional[float] = 0
    transferred_amount: Optional[float] = 0
    bank_name: Optional[BankName] = None
    bank_account_number: Optional[str] = None

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
