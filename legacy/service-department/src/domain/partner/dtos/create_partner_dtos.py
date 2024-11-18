""" Module for Partner Dtos
"""

from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.partner import Partner, PartnerCategory
from src.domain.partner.models.bank_account import BankName
from src.domain.partner.models.branch import Coordinates


@dataclass(frozen=True)
class BranchDto(BaseInputDto):
    governorate: int
    city_id: int
    area_id: int
    area: str
    street: str
    location: Coordinates
    google_maps_link: str


@dataclass(frozen=True)
class BankAccountDto(BaseInputDto):
    bank_name: BankName
    branch_name: str
    beneficiary_name: str
    iban: str
    swift_code: str
    account_number: str


@dataclass(frozen=True)
class AdminUserDto(BaseInputDto):
    first_name: str
    last_name: str
    phone_number: str
    email: str


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    name: str
    categories: list[PartnerCategory]
    tax_registration_number: str
    commercial_registration_number: str
    admin_user: AdminUserDto
    bank_account: BankAccountDto


@dataclass
class OutputDto(BaseOutputDto):
    partner: Partner

    def to_dict(self):
        result = asdict(self.partner, dict_factory=asdict_factory)
        return result
