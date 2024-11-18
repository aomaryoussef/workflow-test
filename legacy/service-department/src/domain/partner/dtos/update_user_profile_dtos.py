from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory


@dataclass
class UpdateUserProfileOutputDto:
    result: bool

    def __init__(self, result: bool):
        self.result = result

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
