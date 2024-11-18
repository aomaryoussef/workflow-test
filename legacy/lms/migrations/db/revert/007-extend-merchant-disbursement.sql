BEGIN;

ALTER TABLE public.merchant_transaction_slip
  DROP COLUMN updated_at;

COMMIT;