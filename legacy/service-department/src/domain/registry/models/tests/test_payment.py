import unittest
from datetime import datetime, timezone
from src.domain.registry.models.payment import (
    Payment,
    PaymentStatus,
    PaymentChannel,
    PayeeType,
    PayeeIdType,
    CurrencyCode,
    ULID,
)


class TestPayment(unittest.TestCase):

    def setUp(self):
        self.now = datetime.now(timezone.utc)
        self.payee_id = "payee_id"
        self.payee_type = PayeeType.CONSUMER
        self.payee_id_type = PayeeIdType.GLOBAL_UID
        self.billing_account = "billing_account"
        self.billing_account_schedule_id = "billing_account_schedule_id"
        self.amount_units = 100
        self.amount_currency = CurrencyCode.EGP
        self.channel_reference_id = "channel_reference_id"
        self.channel_transaction_id = "channel_transaction_id"
        self.channel = PaymentChannel.BTECH_STORE
        self.metadata = {"key": "value"}
        self.raw_request = {"key": "value"}
        self.created_by = "created_by"
        self.payment = Payment(
            channel=self.channel,
            channel_reference_id=self.channel_reference_id,
            channel_transaction_id=self.channel_transaction_id,
            payee_id=self.payee_id,
            payee_type=self.payee_type,
            billing_account=self.billing_account,
            billing_account_schedule_id=self.billing_account_schedule_id,
            booking_time=self.now,
            amount_units=self.amount_units,
            created_by=self.created_by,
            created_at=self.now,
            updated_at=self.now,
            raw_request=self.raw_request,
            payee_id_type=self.payee_id_type,
            amount_currency=self.amount_currency,
            metadata=self.metadata,
        )

    def test_payment_initialization(self):
        self.assertIsInstance(self.payment.id, ULID)
        self.assertEqual(self.payment.status, PaymentStatus.CREATED)
        self.assertEqual(self.payment.channel, self.channel)
        self.assertEqual(self.payment.channel_reference_id, self.channel_reference_id)
        self.assertEqual(self.payment.channel_transaction_id, self.channel_transaction_id)
        self.assertEqual(self.payment.payee_id, self.payee_id)
        self.assertEqual(self.payment.payee_type, self.payee_type)
        self.assertEqual(self.payment.payee_id_type, self.payee_id_type)
        self.assertEqual(self.payment.billing_account, self.billing_account)
        self.assertEqual(self.payment.billing_account_schedule_id, self.billing_account_schedule_id)
        self.assertEqual(self.payment.amount_units, self.amount_units)
        self.assertEqual(self.payment.amount_currency, self.amount_currency)
        self.assertEqual(self.payment.raw_request, self.raw_request)
        self.assertEqual(self.payment.booking_time, self.now)
        self.assertEqual(self.payment.created_at, self.now)
        self.assertEqual(self.payment.created_by, self.created_by)
        self.assertEqual(self.payment.updated_at, self.now)
        self.assertEqual(self.payment.metadata, self.metadata)

    def test_payment_deserialization(self):
        payment_dict = self.payment.to_dict()
        deserialized_payment = Payment.from_dict(payment_dict)

        self.assertIsInstance(ULID.from_str(deserialized_payment.id), ULID)
        self.assertEqual(deserialized_payment.status, PaymentStatus.CREATED)
        self.assertEqual(PaymentChannel[deserialized_payment.channel], self.channel)
        self.assertEqual(deserialized_payment.channel_reference_id, self.channel_reference_id)
        self.assertEqual(deserialized_payment.channel_transaction_id, self.channel_transaction_id)
        self.assertEqual(deserialized_payment.payee_id, self.payee_id)
        self.assertEqual(PayeeType[deserialized_payment.payee_type], self.payee_type)
        self.assertEqual(PayeeIdType[deserialized_payment.payee_id_type], self.payee_id_type)
        self.assertEqual(deserialized_payment.billing_account, self.billing_account)
        self.assertEqual(deserialized_payment.billing_account_schedule_id, self.billing_account_schedule_id)
        self.assertEqual(deserialized_payment.amount_units, self.amount_units)
        self.assertEqual(deserialized_payment.amount_currency, self.amount_currency)
        self.assertEqual(deserialized_payment.raw_request, self.raw_request)
        self.assertEqual(deserialized_payment.booking_time, self.now)
        self.assertEqual(deserialized_payment.created_at, self.now)
        self.assertEqual(deserialized_payment.created_by, self.created_by)
        self.assertEqual(deserialized_payment.updated_at, self.now)
        self.assertEqual(deserialized_payment.metadata, self.metadata)
