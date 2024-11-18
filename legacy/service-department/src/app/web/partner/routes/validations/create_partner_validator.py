from typing import Optional
from pydantic import BaseModel
from src.domain.partner.models.partner import PartnerCategory
from src.domain.partner.models.bank_account import BankName


class PartnerAdminValidator(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone_number: str


class BankAccountValidator(BaseModel):
    bank_name: BankName
    branch_name: str
    beneficiary_name: str
    iban: str
    swift_code: Optional[str] = ''
    account_number: str

    class Config:
        use_enum_values = True


class LocationValidator(BaseModel):
    latitude: str
    longitude: str


class PartnerBranchValidator(BaseModel):
    governorate_id: int
    city_id: int
    area_id: Optional[int] = None
    area:  Optional[str] = None
    street: str
    location: LocationValidator
    google_maps_link: str

    class Config:
        use_enum_values = True


class CreatePartnerValidator(BaseModel):
    name: str
    categories: list[PartnerCategory]
    tax_registration_number: str
    commercial_registration_number: Optional[str] = None
    admin_user_profile: PartnerAdminValidator
    bank_account: BankAccountValidator

    class Config:
        use_enum_values = True
