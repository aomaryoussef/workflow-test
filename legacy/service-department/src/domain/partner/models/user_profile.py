""" This module has the definition of the UserProfile entity
"""

from dataclasses import asdict, dataclass
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum


from src.utils.dict_factory import asdict_factory


class ProfileType(Enum):
    CASHIER = "CASHIER"
    BRANCH_MANAGER = "BRANCH_MANAGER"
    ADMIN = "ADMIN"


class UserProfileState(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


@dataclass
class UserProfile:
    """Definition of the UserProfile entity"""

    id: UUID
    iam_id: UUID
    partner_id: UUID
    branch_id: UUID
    first_name: str
    last_name: str
    email: str
    phone_number: str
    national_id: str
    profile_type: ProfileType
    created_at: datetime
    updated_at: datetime

    def __init__(
        self,
        iam_id: UUID,
        partner_id: UUID,
        first_name: str,
        last_name: str,
        phone_number: str,
        email: str = None,
        national_id: str = None,
        profile_type: ProfileType = ProfileType.CASHIER,
        id: UUID = None,
        branch_id: UUID = None,
    ):
        self.id = uuid4() if id is None else id
        self.iam_id = iam_id
        self.partner_id = partner_id
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.phone_number = phone_number
        self.national_id = national_id
        self.profile_type = profile_type
        self.branch_id = branch_id
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
