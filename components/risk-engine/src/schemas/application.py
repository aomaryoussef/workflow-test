from datetime import date, datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Extra, conint, constr
from src.schemas.iscore import IScoreApplicationDataInput
from src.schemas.lookup import HouseType, JobNameMap, MaritalStatus, MobileOsType, Scenario
from src.utils.monetary import AmountInCents

class CreditScoreApplicationInput(BaseModel):
    client_id: UUID
    ssn: constr(min_length=14, max_length=14)
    phone_number_1: constr(min_length=10, max_length=15)
    phone_number_2: Optional[constr(min_length=10, max_length=15)] = None
    flag_is_mc_customer: conint(ge=0, le=1)
    contract_date: datetime  # This will ensure the format is "YYYY-MM-DDTHH:MM:SS"
    job_name_map: JobNameMap
    net_income: conint(ge=0)  # Now directly taking the integer amount in cents
    net_burden: conint(ge=0)  # Same for net_burden
    insurance_type: Optional[str] = None
    marital_status: MaritalStatus
    children_count: conint(ge=0)
    # TODO: lookup table
    address_governorate: str
    # TODO: lookup table
    address_city: str
    # TODO: lookup table
    address_area: str
    house_type: HouseType
    car_type_id: Optional[int] = None
    car_model_year: Optional[date] = None
    club_level: Optional[str] = None
    mobile_os_type: Optional[MobileOsType] = None
    iscore: Optional[IScoreApplicationDataInput] = None

    class Config:
        use_enum_values = (
            True  # This allows using enum values instead of enum names in JSON
        )
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "client_id": "9a16b606-a29c-4472-92a1-ce8627a1401e",
                "ssn": "12345678912345",
                "phone_number_1": "01000000000",
                "phone_number_2": "01000000000",
                "flag_is_mc_customer": 1,
                "contract_date": "2019-02-06T00:00:00",
                "job_name_map": "healthcare",
                "net_income": 3450000,  # 34,500 pounds in cents
                "net_burden": 0,  # Non-negative value
                "insurance_type": "ios",
                "marital_status": "married",
                "children_count": 2,
                "address_governorate": "Alexandria",
                "address_city": "Sidi Gaber",
                "address_area": "Sidi Gaber",
                "house_type": "owned",
                "car_type_id": None,
                "car_model_year": None,
                "club_level": None,
                "mobile_os_type": "ios",
                "iscore": IScoreApplicationDataInput.Config.json_schema_extra["example"],
            }
        }

class CreditScoreInput(BaseModel):
    data: CreditScoreApplicationInput
    booking_time: datetime
    scenario: Scenario

    class Config:
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "data": CreditScoreApplicationInput.Config.json_schema_extra["example"],
                "booking_time": "2023-01-01T00:00:00",
                "scenario": "SCORING",
            }
        }
        