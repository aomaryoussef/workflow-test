from ulid import ULID
from sqlalchemy import DateTime, Enum, Integer, func, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from src.domain.registry.models.payment import PayeeIdType, PayeeType, PaymentChannel, PaymentStatus, CurrencyCode


class BaseDBModel(DeclarativeBase):
    """Base class for all models"""

    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    created_by: Mapped[str] = mapped_column(String(80), nullable=False)


class PaymentDBModel(BaseDBModel):
    """Defines the Partner database model"""

    __tablename__ = "registry_payment"
    __table_args__ = {"extend_existing": True}

    id: Mapped[str] = mapped_column(String(26), primary_key=True, default=str(ULID()))
    status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), nullable=False)
    channel: Mapped[PaymentChannel] = mapped_column(Enum(PaymentChannel), nullable=False)
    channel_reference_id: Mapped[str] = mapped_column(String(80), nullable=False)
    channel_transaction_id: Mapped[str] = mapped_column(String(80), nullable=False)
    payee_id: Mapped[str] = mapped_column(String(80), nullable=False)
    payee_type: Mapped[PayeeType] = mapped_column(Enum(PayeeType), nullable=False)
    payee_id_type: Mapped[PayeeIdType] = mapped_column(Enum(PayeeIdType), nullable=False)
    billing_account: Mapped[str] = mapped_column(String(80), nullable=False)
    billing_account_schedule_id: Mapped[int] = mapped_column(Integer, nullable=False)
    amount_units: Mapped[int] = mapped_column(Integer, nullable=False)
    amount_currency: Mapped[CurrencyCode] = mapped_column(Enum(CurrencyCode), nullable=False, default=CurrencyCode.EGP)
    raw_request: Mapped[dict[str, any]] = mapped_column(JSONB, nullable=True)
    booking_time: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), nullable=False)
