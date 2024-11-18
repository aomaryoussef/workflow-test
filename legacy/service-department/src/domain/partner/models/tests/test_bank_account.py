from uuid import UUID
from src.domain.partner.models.bank_account import BankAccount, BankName


def test_bank_account_creation():
    bank_account = BankAccount(
        partner_id="123e4567-e89b-12d3-a456-426614174000",
        bank_name=BankName.CIB,
        branch_name="Maadi Branch",
        beneficiary_name="John Doe",
        iban="EG93CIBE0000000001567890123",
        swift_code="CIBEEGCX",
        account_number="01234567891",
    )

    assert isinstance(bank_account.id, UUID)
    assert bank_account.partner_id == "123e4567-e89b-12d3-a456-426614174000"
    assert bank_account.bank_name == BankName.CIB
    assert bank_account.branch_name == "Maadi Branch"
    assert bank_account.beneficiary_name == "John Doe"
    assert bank_account.iban == "EG93CIBE0000000001567890123"
    assert bank_account.swift_code == "CIBEEGCX"
    assert bank_account.account_number == "01234567891"


def test_bank_account_dict_serialization():
    bank_account = BankAccount(
        partner_id="123e4567-e89b-12d3-a456-426614174000",
        bank_name=BankName.CIB,
        branch_name="Maadi Branch",
        beneficiary_name="John Doe",
        iban="EG93CIBE0000000001567890123",
        swift_code="CIBEEGCX",
        account_number="01234567891",
    )

    bank_account_dict = bank_account.to_dict()

    assert bank_account_dict["id"] == str(bank_account.id)
    assert bank_account_dict["partner_id"] == str(bank_account.partner_id)
    assert bank_account_dict["bank_name"] == bank_account.bank_name.value
    assert bank_account_dict["branch_name"] == bank_account.branch_name
    assert bank_account_dict["beneficiary_name"] == bank_account.beneficiary_name
    assert bank_account_dict["iban"] == bank_account.iban
    assert bank_account_dict["swift_code"] == bank_account.swift_code
    assert bank_account_dict["account_number"] == bank_account.account_number
