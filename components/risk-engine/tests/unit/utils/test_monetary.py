import pytest
from src.utils.monetary import AmountInCents

def test_validate_amount_gte():
    # Test: Value is greater than or equal to the gte constraint
    assert AmountInCents.validate_amount(100, gte=100) == 100  # Pass
    assert AmountInCents.validate_amount(150, gte=100) == 150  # Pass
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(50, gte=100)  # Fail

def test_validate_amount_gt():
    # Test: Value is greater than the gt constraint
    assert AmountInCents.validate_amount(101, gt=100) == 101  # Pass
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(100, gt=100)  # Fail
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(99, gt=100)  # Fail

def test_validate_amount_lte():
    # Test: Value is less than or equal to the lte constraint
    assert AmountInCents.validate_amount(100, lte=100) == 100  # Pass
    assert AmountInCents.validate_amount(99, lte=100) == 99  # Pass
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(101, lte=100)  # Fail

def test_validate_amount_lt():
    # Test: Value is less than the lt constraint
    assert AmountInCents.validate_amount(99, lt=100) == 99  # Pass
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(100, lt=100)  # Fail
    with pytest.raises(ValueError):
        AmountInCents.validate_amount(101, lt=100)  # Fail

def test_to_pounds():
    # Test: Conversion from cents to pounds
    assert AmountInCents.to_pounds(100) == 1.0  # 100 cents = 1 pound
    assert AmountInCents.to_pounds(250) == 2.5  # 250 cents = 2.5 pounds

def test_from_pounds():
    # Test: Conversion from pounds to cents
    assert AmountInCents.from_pounds(1.0) == 100  # 1 pound = 100 cents
    assert AmountInCents.from_pounds(2.5) == 250  # 2.5 pounds = 250 cents

