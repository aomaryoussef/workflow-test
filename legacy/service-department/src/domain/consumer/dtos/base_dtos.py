from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory


@dataclass(frozen=True)
class BaseInputDto:
    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result


@dataclass
class BaseOutputDto:
    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
