from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Extra
from enum import Enum


class JobNameMap(str, Enum):
    BusinessOwner = "business-owner"
    ConstructionTrades = "construction-trades"
    Engineer = "engineer"
    Finance = "finance"
    GovernmentalEmployee = "governmental-employee"
    Healthcare = "healthcare"
    Legal = "legal"
    Manager = "manager"
    Military = "military"
    OtherEmployed = "other-employed"
    OtherFreelancer = "other-freelancer"
    PoliceOfficer = "police-officer"
    Retired = "retired"
    Sales = "sales"
    Student = "student"
    Teaching = "teaching"
    Unemployed = "unemployed"


# class JobType(str, Enum):
#     Crafts = "crafts"
#     Gov = "gov"
#     Pension = "pension"
#     PrimeEntities = "prime-entities"
#     Priv = "priv"
#     Student = "student"
#     OtherEmployed = "other-employed"
#     OtherFreelancer = "other-freelancer"
#     Unemployed = "unemployed"


class MobileOsType(str, Enum):
    Android = "android"
    IOS = "ios"
    Other = "other"


class HouseType(str, Enum):
    NewRent = "new-rent"
    OldRent = "old-rent"
    Owned = "owned"


class MaritalStatus(str, Enum):
    Single = "single"
    Married = "married"
    Divorced = "divorced"
    Widowed = "widowed"


class Scenario(str, Enum):
    Scoring = "SCORING"  # Customer initiated score - non-verified RE output
    VerifiedScore = "VERIFIED_SCORE"  # Credit Officer initiated score (verified fields) - verified RE output
    VerifiedScoreIncome = "VERIFIED_SCORE_INCOME"  # Credit Officer initiated score (verified fields + income) - verified RE output


class LookupType(str, Enum):
    job_name_map = "job_name_map"
    job_type = "job_type"
    mobile_os_type = "mobile_os_type"
    house_type = "house_type"
    marital_status = "marital_status"
    scenario = "scenario"


# Pydantic model for lookup response
class LookupResponse(BaseModel):
    id: UUID
    lookup_type: str
    slug: str
    name: str
    description: Optional[str] = None

    class Config:
        use_enum_values = True  # This allows using enum values instead of enum names in JSON
        extra = Extra.forbid  # This forbids extra fields
        json_schema_extra = {
            "example": {
                "id": "9a16b606-a29c-4472-92a1-ce8627a1401e",
                "lookup_type": "job_name",
                "slug": "business-owner",
                "name": "Business owner",
                "description": "Description of the lookup"
            }
        }
