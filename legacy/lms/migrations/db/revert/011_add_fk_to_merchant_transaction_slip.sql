-- story id: CALM-122
BEGIN;
    ALTER TABLE public.merchant_transaction_slip DROP CONSTRAINT IF EXISTS fk_merchant_payment_id_merchant_transaction_slip;
    ALTER TABLE public.merchant_transaction_slip DROP COLUMN IF EXISTS merchant_payment_id;
COMMIT;
