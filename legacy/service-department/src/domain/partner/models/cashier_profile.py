""" This module has the definition of the UserProfile entity
"""

from dataclasses import asdict, dataclass
from uuid import UUID, uuid4


from src.utils.dict_factory import asdict_factory


@dataclass
class CashierProfile:
    """Definition of the CashierProfile entity"""

    iam_id: UUID
    partner_id: UUID
    cashier_id: UUID
    partner_name: str
    branch_id: UUID

    def __init__(self, iam_id: UUID, partner_id: UUID, cashier_id: UUID, partner_name: str, branch_id: UUID):
        self.id = uuid4()
        self.iam_id = iam_id
        self.partner_id = partner_id
        self.cashier_id = cashier_id
        self.partner_name = partner_name
        self.branch_id = branch_id

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
