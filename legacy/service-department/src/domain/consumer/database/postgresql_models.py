import uuid
from sqlalchemy import NUMERIC, DateTime, Enum, String, Uuid, func, Integer, Text, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from src.domain.consumer.models.consumer import ConsumerStatus


class BaseDBModel(DeclarativeBase):
    """Base class for all models"""

    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())


class ConsumerDBModel(BaseDBModel):
    __tablename__ = "consumers"
    __table_args__ = {"extend_existing": True}

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    phone_number: Mapped[str] = mapped_column(String(20), nullable=False, index=True, unique=True)
    status: Mapped[ConsumerStatus] = mapped_column(Enum(ConsumerStatus), nullable=False)
    iam_id: Mapped[str] = mapped_column(String, nullable=True, index=True)

    full_name: Mapped[str] = mapped_column(String, nullable=True)
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    last_name: Mapped[str] = mapped_column(String, nullable=True)
    national_id: Mapped[str] = mapped_column(String, nullable=True)
    job_name: Mapped[str] = mapped_column(String, nullable=True)
    work_type: Mapped[str] = mapped_column(String, nullable=True)
    company: Mapped[str] = mapped_column(String, nullable=True)
    club: Mapped[str] = mapped_column(String, nullable=True)
    house_type: Mapped[str] = mapped_column(String, nullable=True)
    city: Mapped[str] = mapped_column(String, nullable=True)
    district: Mapped[str] = mapped_column(String, nullable=True)
    governorate: Mapped[str] = mapped_column(String, nullable=True)
    salary: Mapped[float] = mapped_column(NUMERIC, nullable=True)
    additional_salary: Mapped[float] = mapped_column(NUMERIC, nullable=True)
    address_description: Mapped[str] = mapped_column(Text, nullable=True)
    guarantor_job: Mapped[str] = mapped_column(String, nullable=True)
    guarantor_relationship: Mapped[str] = mapped_column(String, nullable=True)
    car_year: Mapped[int] = mapped_column(Integer, nullable=True)
    marital_status: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    single_payment_day: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    activated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    activated_by_iam_id: Mapped[str] = mapped_column(String, nullable=True)
    activation_branch: Mapped[str] = mapped_column(String, nullable=True)
    origination_channel: Mapped[str] = mapped_column(String, nullable=False, default="minicash")
    classification: Mapped[str] = mapped_column(String, nullable=False, default="NA")
    national_id_address: Mapped[str] = mapped_column(String, nullable=True)
    home_phone_number: Mapped[str] = mapped_column(String, nullable=True)
    company_address: Mapped[str] = mapped_column(String, nullable=True)
    work_phone_number: Mapped[str] = mapped_column(String, nullable=True)
    additional_salary_source: Mapped[str] = mapped_column(String, nullable=True)
    credit_limit = relationship("NewConsumerCreditLimitDBModel")


class NewConsumerCreditLimitDBModel(BaseDBModel):
    __tablename__ = "consumer_credit_limits"
    __table_args__ = {"extend_existing": True}

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    consumer_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("consumers.id"), nullable=False)

    max_credit_limit: Mapped[int] = mapped_column(Integer, nullable=False)

    available_credit_limit: Mapped[int] = mapped_column(Integer, nullable=False)

    active_since: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)


class UsedConsumerCreditLimitDBModel(BaseDBModel):
    __tablename__ = "consumer_used_credit_limits"
    __table_args__ = {"extend_existing": True}

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)

    consumer_id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("consumers.id"), nullable=False)

    used_credit: Mapped[int] = mapped_column(Integer, nullable=False)


class BetaConsumerDBModel(BaseDBModel):
    __tablename__ = "beta_consumers"
    __table_args__ = {"extend_existing": True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True, server_default="nextval('beta_consumers_id_seq'::regclass)", autoincrement=True)
    phone_number: Mapped[str] = mapped_column(String(255), nullable=False)