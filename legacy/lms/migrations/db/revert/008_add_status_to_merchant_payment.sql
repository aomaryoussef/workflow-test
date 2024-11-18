-- story id: CALM-108
BEGIN;
    -- Remove status_timestamp column
    ALTER TABLE merchant_payment DROP COLUMN IF EXISTS status_timestamp;

    -- Remove status column
    ALTER TABLE merchant_payment DROP COLUMN IF EXISTS status;
COMMIT;