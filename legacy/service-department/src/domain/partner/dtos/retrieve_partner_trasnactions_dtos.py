from uuid import UUID
from dataclasses import dataclass, field
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.dtos.retrieve_partner_transaction_details_dtos import (
    OutputDto as RetrievePartnerTransactionDetailsOutputDto,
)


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    partner_id: UUID
    page: int = 1
    per_page: int = 10


@dataclass
class OutputDto(BaseOutputDto):
    transactions: list[RetrievePartnerTransactionDetailsOutputDto] = field(default_factory=list)
    total_count: int = 0

    def to_dict(self):
        return {
            "data": [transaction.to_dict() for transaction in self.transactions],
            "total_count": self.total_count,
        }
