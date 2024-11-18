""" This module has the definition of the Partner entity
"""

from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4
from src.domain.partner.models.branch import Branch
from src.domain.partner.models.bank_account import BankAccount
from src.domain.partner.models.user_profile import UserProfile

from src.utils.dict_factory import asdict_factory


class PartnerCategory(Enum):
    ELECTRONICS = "ELECTRONICS"
    FASHION = "FASHION"
    FURNITURE = "FURNITURE"
    CERAMICS_AND_SANITARY_WARE = "CERAMICS_AND_SANITARY_WARE"
    AUTO_SPARE_PARTS = "AUTO_SPARE_PARTS"
    BABY_AND_TOYS = "BABY_AND_TOYS"
    JEWELRY = "JEWELRY"
    SUPERMARKETS = "SUPERMARKETS"
    EVENT_PLANNING = "EVENT_PLANNING"
    EDUCATION = "EDUCATION"
    MOTORCYCLES = "MOTORCYCLES"
    HOME_WARE = "HOME_WARE"
    TOURISM_AND_ENTERTAINMENT = "TOURISM_AND_ENTERTAINMENT"
    MEDICAL = "MEDICAL"
    ACCESSORIES = "ACCESSORIES"
    WEDDING_HALLS = "WEDDING_HALLS"
    OPTICS = "OPTICS"
    SPORTS = "SPORTS"
    FINISHING = "FINISHING"
    MOBILE = "MOBILE"
    SHOPPING_HUBS = "SHOPPING_HUBS"


class PartnerStatus(Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"


@dataclass
class Partner:
    """Definition of the Partner entity"""

    id: UUID
    name: str
    categories: list[PartnerCategory]
    status: PartnerStatus
    tax_registration_number: str
    commercial_registration_number: str
    created_at: datetime
    updated_at: datetime
    branches: list[Branch]
    bank_accounts: list[BankAccount]
    user_profiles: list[UserProfile]

    def __init__(
        self,
        name: str,
        categories: list[PartnerCategory],
        tax_registration_number: str,
        commercial_registration_number: str,
        branches: list[Branch] = [],
        bank_accounts: list[BankAccount] = None,
        user_profiles: list[UserProfile] = None,
        status: PartnerStatus = PartnerStatus.ACTIVE,
        id: UUID = None,
    ):
        self.id = uuid4() if id is None else id
        self.name = name
        self.categories = categories
        self.status = status
        self.tax_registration_number = tax_registration_number
        self.commercial_registration_number = commercial_registration_number
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.branches = branches
        self.bank_accounts = bank_accounts if bank_accounts is not None else []
        self.user_profiles = user_profiles if user_profiles is not None else []

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
