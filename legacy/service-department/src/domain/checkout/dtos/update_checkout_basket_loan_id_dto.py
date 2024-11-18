from dataclasses import asdict, dataclass
from uuid import UUID


@dataclass
class UpdateCheckoutBasketLoanIdInputDto:
    id: UUID
    loan_id: UUID

    def __init__(self, loan_id: UUID, id: UUID):
        self.loan_id = loan_id
        self.id = id

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)
