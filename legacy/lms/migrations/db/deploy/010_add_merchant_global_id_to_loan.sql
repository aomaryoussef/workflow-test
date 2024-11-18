-- story id: CALM-122
BEGIN;
    ALTER TABLE loan ADD COLUMN merchant_global_id VARCHAR(50) NOT NULL DEFAULT uuid_generate_v1();
    ALTER TABLE IF EXISTS merchant_payment_transaction_slip DROP CONSTRAINT IF EXISTS fk_payment_id_merchant_payment_transaction_slip;
    ALTER TABLE IF EXISTS merchant_payment_transaction_slip DROP CONSTRAINT IF EXISTS fk_transaction_slip_id_merchant_payment_transaction_slip;
    DROP TABLE IF EXISTS merchant_payment_transaction_slip;
COMMIT;