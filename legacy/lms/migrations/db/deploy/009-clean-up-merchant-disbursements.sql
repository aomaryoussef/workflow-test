-- Deploy lms-lite:009-clean-up-merchant-disbursements to pg

BEGIN;

-- XXX Add DDLs here.

-- TODO: remove useless columns from merchant_payment:
-- integration_point, journal_name, account_type, invoice_number
ALTER TABLE public.merchant_payment
  DROP COLUMN integration_point,
  DROP COLUMN journal_name,
  DROP COLUMN account_type,
  DROP COLUMN invoice_number;

-- TODO: add sequential int id column to merchant_payment
ALTER TABLE public.merchant_payment
  ADD COLUMN serial_id SERIAL;

COMMIT;
