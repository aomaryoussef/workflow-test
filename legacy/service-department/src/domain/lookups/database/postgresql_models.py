from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class BaseDBModel(DeclarativeBase):
    """Base class for all models"""
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())


class GovernorateDBModel(BaseDBModel):
    __tablename__ = "governorates"
    __table_args__ = {"extend_existing": True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mc_id: Mapped[int] = mapped_column(Integer, unique=True)
    name_ar: Mapped[str] = mapped_column(String(255))
    name_en: Mapped[str] = mapped_column(String(255))

    cities = relationship("CityDBModel", back_populates="governorate")
    areas = relationship("AreaDBModel", back_populates="governorate")


class CityDBModel(BaseDBModel):
    __tablename__ = "cities"
    __table_args__ = {"extend_existing": True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mc_id: Mapped[int] = mapped_column(Integer, unique=True)
    name_ar: Mapped[str] = mapped_column(String(255))
    name_en: Mapped[str] = mapped_column(String(255))
    governorate_id: Mapped[int] = mapped_column(Integer, ForeignKey('governorates.id'), nullable=False)

    governorate = relationship("GovernorateDBModel", back_populates="cities")
    areas = relationship("AreaDBModel", back_populates="city")


class AreaDBModel(BaseDBModel):
    __tablename__ = "areas"
    __table_args__ = {"extend_existing": True}

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mc_id: Mapped[int] = mapped_column(Integer, unique=True)
    name_ar: Mapped[str] = mapped_column(String(255))
    name_en: Mapped[str] = mapped_column(String(255))
    city_id: Mapped[int] = mapped_column(Integer, ForeignKey('cities.id'), nullable=False)
    governorate_id: Mapped[int] = mapped_column(Integer, ForeignKey('governorates.id'), nullable=False)

    city = relationship("CityDBModel", back_populates="areas")
    governorate = relationship("GovernorateDBModel", back_populates="areas")
