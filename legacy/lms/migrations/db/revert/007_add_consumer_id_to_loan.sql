-- story id: CALM-107
BEGIN;
    ALTER TABLE loan DROP COLUMN IF EXISTS consumer_id;
COMMIT;