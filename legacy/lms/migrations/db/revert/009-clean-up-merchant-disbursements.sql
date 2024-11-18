-- Revert lms-lite:009-clean-up-merchant-disbursements from pg

BEGIN;

-- XXX Add DDLs here.
ALTER TABLE public.merchant_payment
  DROP COLUMN serial_id;

ALTER TABLE public.merchant_payment
  ADD COLUMN integration_point     VARCHAR(20) NOT NULL DEFAULT 'Due',
  ADD COLUMN journal_name          VARCHAR(10) NOT NULL DEFAULT 'TODO',
  ADD COLUMN account_type          VARCHAR(10) NOT NULL DEFAULT 'Vendor',
  ADD COLUMN invoice_number        VARCHAR NOT NULL DEFAULT 'TODO'
;

COMMIT;
