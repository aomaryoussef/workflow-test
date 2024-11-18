from dataclasses import asdict, dataclass


@dataclass
class GetConsumerMonthlyAvailableCreditLimitsOutputDto:
    available_limit: int
    monthly_limit: int

    def to_dict(self):
        """Convert data into dictionary"""
        return asdict(self)