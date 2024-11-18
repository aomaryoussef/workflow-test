from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.dtos.base_dtos import BaseInputDto, BaseOutputDto
from src.domain.partner.models.partner import Partner, PartnerCategory


@dataclass(frozen=True)
class InputDto(BaseInputDto):
    name: str
    categories: list[PartnerCategory]
    tax_registration_number: str
    commercial_registration_number: str


@dataclass
class OutputDto(BaseOutputDto):
    partner: Partner

    def to_dict(self):
        result = asdict(self.partner, dict_factory=asdict_factory)
        return result
