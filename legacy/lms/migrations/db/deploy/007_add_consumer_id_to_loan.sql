-- story id: CALM-107
BEGIN;
    ALTER TABLE loan ADD COLUMN consumer_id VARCHAR(50) NOT NULL DEFAULT uuid_generate_v1();
COMMIT;