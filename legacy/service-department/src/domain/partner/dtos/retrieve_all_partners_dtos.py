from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory
from src.domain.partner.models.partner import Partner
from src.domain.partner.dtos.base_dtos import BaseOutputDto


@dataclass
class OutputDto(BaseOutputDto):
    partners: list[Partner]

    def to_dict(self):
        result = [asdict(partner, dict_factory=asdict_factory) for partner in self.partners]
        return result
