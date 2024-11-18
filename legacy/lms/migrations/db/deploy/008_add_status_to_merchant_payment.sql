-- story id: CALM-108
BEGIN;
    -- Add status column
    ALTER TABLE merchant_payment ADD COLUMN status VARCHAR(30);

    -- Add status_timestamp column
    ALTER TABLE merchant_payment ADD COLUMN status_timestamp DATE;
COMMIT;