from dataclasses import asdict, dataclass
from src.utils.dict_factory import asdict_factory


@dataclass(frozen=True)
class ResetUserPasswordInputDto:
    """Input Dto for resetting user password"""

    identifier: str

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)


@dataclass
class ResetUserPasswordOutputDto:
    """Output Dto for resetting user password"""

    recovery_flow_id: str

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
