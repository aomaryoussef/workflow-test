BEGIN;

ALTER TABLE public.merchant_transaction_slip
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

COMMIT;