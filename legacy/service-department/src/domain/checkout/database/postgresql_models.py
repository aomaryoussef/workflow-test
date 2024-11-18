from uuid import uuid4

from sqlalchemy import DateTime, String, Uuid, func, Enum, Integer, BigInteger, text 
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from src.domain.checkout.models.checkout_basket import CheckoutBasketStatus


class BaseDBModel(DeclarativeBase):
    """Base class for all models"""

    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())


class CheckoutBasketDBModel(BaseDBModel):
    """Defines the Checkout Basket database model"""

    __tablename__ = "checkout_baskets"
    __table_args__ = {"extend_existing": True}

    id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid4)
    workflow_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), nullable=True)
    partner_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True))
    cashier_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True))
    branch_id: Mapped[Uuid] = mapped_column(
        Uuid(as_uuid=True),
    )
    consumer_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True))
    session_basket_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True))
    status: Mapped[CheckoutBasketStatus] = mapped_column(
        Enum(CheckoutBasketStatus), default=CheckoutBasketStatus.CREATED
    )
    products: Mapped[list[dict[str, any]]] = mapped_column(JSONB)
    gross_basket_value: Mapped[int] = mapped_column(Integer)
    commercial_offers: Mapped[list[dict[str, any]]] = mapped_column(JSONB, nullable=True)
    selected_commercial_offer_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), nullable=True)
    consumer_device_metadata: Mapped[dict[str, any]] = mapped_column(JSONB)
    loan_id: Mapped[Uuid] = mapped_column(Uuid(as_uuid=True), nullable=True)
    category: Mapped[str] = mapped_column(String(200), nullable=True)
    transaction_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False, 
                    server_default=text("(floor(random() * 1e16)::BIGINT + 1e15)::BIGINT")) 
    origination_channel: Mapped[str] = mapped_column(String(200), nullable=True)
