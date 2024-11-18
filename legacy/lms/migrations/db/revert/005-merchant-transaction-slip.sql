-- Revert lms-lite:005-merchant-transaction-slip from pg


BEGIN;

DROP TABLE public.merchant_payment_transaction_slip;
DROP TABLE public.merchant_payment;
DROP TABLE public.merchant_transaction_slip;

COMMIT;