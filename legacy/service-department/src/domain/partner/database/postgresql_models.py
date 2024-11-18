import uuid
from sqlalchemy import ARRAY, DateTime, Enum, ForeignKey, Integer, String, Uuid, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from src.domain.partner.models.partner import PartnerCategory, PartnerStatus
from src.domain.partner.models.bank_account import BankName
from src.domain.partner.models.user_profile import ProfileType


class BaseDBModel(DeclarativeBase):
    """Base class for all models"""

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())


class PartnerDBModel(BaseDBModel):
    """Defines the Partner database model"""

    __tablename__ = "partner"

    name: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    categories: Mapped[list[PartnerCategory]] = mapped_column(ARRAY(Enum(PartnerCategory)), nullable=False)
    status: Mapped[PartnerStatus] = mapped_column(Enum(PartnerStatus), nullable=False)
    tax_registration_number: Mapped[str] = mapped_column(String(9), nullable=False, unique=True)
    commercial_registration_number: Mapped[str] = mapped_column(String(80), nullable=True, unique=False)

    branches = relationship("BranchDBModel", back_populates="partner")
    bank_accounts = relationship("BankAccountDBModel", back_populates="partner")
    user_profiles = relationship("UserProfileDBModel", back_populates="partner")
    top_partners = relationship("TopPartnerDBModel", back_populates="partner")


class BranchDBModel(BaseDBModel):
    """Defines the Branch database model"""

    __tablename__ = "partner_branch"
    __table_args__ = {"extend_existing": True}

    partner_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("partner.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False, default="")
    area: Mapped[str] = mapped_column(String(80), nullable=True)
    street: Mapped[str] = mapped_column(String(80), nullable=False)
    location_latitude: Mapped[str] = mapped_column(String(80), nullable=False)
    location_longitude: Mapped[str] = mapped_column(String(80), nullable=False)
    google_maps_link: Mapped[str] = mapped_column(String(255), nullable=True, default="")
    governorate_id: Mapped[int] = mapped_column(Integer, nullable=True)
    city_id: Mapped[int] = mapped_column(Integer, nullable=True)
    area_id: Mapped[int] = mapped_column(Integer, nullable=True)

    partner = relationship("PartnerDBModel", back_populates="branches")


class BankAccountDBModel(BaseDBModel):
    """Defines the BankAccount database model"""

    __tablename__ = "partner_bank_account"
    __table_args__ = {"extend_existing": True}

    partner_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("partner.id"), nullable=False)
    bank_name: Mapped[BankName] = mapped_column(Enum(BankName), nullable=False)
    branch_name: Mapped[str] = mapped_column(String(80), nullable=False)
    beneficiary_name: Mapped[str] = mapped_column(String(80), nullable=False)
    iban: Mapped[str] = mapped_column(String(80), nullable=False)
    swift_code: Mapped[str] = mapped_column(String(80), nullable=False)
    account_number: Mapped[str] = mapped_column(String(80), nullable=False)

    partner = relationship("PartnerDBModel", back_populates="bank_accounts")


class UserProfileDBModel(BaseDBModel):
    """Defines the UserProfile database model"""

    __tablename__ = "partner_user_profile"
    __table_args__ = {"extend_existing": True}

    iam_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), nullable=False)
    partner_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("partner.id"), nullable=False)
    branch_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("partner_branch.id"), nullable=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_number: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=True)
    national_id: Mapped[str] = mapped_column(String(14), nullable=True)
    profile_type: Mapped[ProfileType] = mapped_column(Enum(ProfileType), nullable=False)
    partner = relationship("PartnerDBModel", back_populates="user_profiles")


class TopPartnerDBModel(BaseDBModel):
    """Defines the TopPartner database model"""

    __tablename__ = "partner_top"
    __table_args__ = {"extend_existing": True}

    partner_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("partner.id"), nullable=False)
    partner = relationship("PartnerDBModel", back_populates="top_partners")
