from pydantic import conint

class AmountInCents:
    """
    This class behaves like an integer with value constraints and provides
    utility methods for converting between cents and pounds.
    """
    
    @staticmethod
    def validate_amount(value: int, gte: int = None, gt: int = None, lte: int = None, lt: int = None) -> int:
        """
        Validate the amount based on greater than, less than, and equality constraints.
        """
        if gte is not None and value < gte:
            raise ValueError(f"Amount {value} must be greater than or equal to {gte} cents")
        if gt is not None and value <= gt:
            raise ValueError(f"Amount {value} must be greater than {gt} cents")
        if lte is not None and value > lte:
            raise ValueError(f"Amount {value} must be less than or equal to {lte} cents")
        if lt is not None and value >= lt:
            raise ValueError(f"Amount {value} must be less than {lt} cents")
        return value

    @staticmethod
    def to_pounds(amount: int) -> float:
        """
        Convert cents to pounds.
        """
        return amount / 100.0

    @staticmethod
    def from_pounds(amount_in_pounds: float) -> int:
        """
        Convert pounds to cents.
        """
        return int(amount_in_pounds * 100)
