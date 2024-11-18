-- Deploy lms-lite:014-add-ref-id-loan-schedule to pg

BEGIN;

ALTER TABLE loan_schedule ADD COLUMN ref_id VARCHAR(200);
ALTER TABLE journal ALTER COLUMN amount TYPE BIGINT USING amount::BIGINT;

COMMIT;
