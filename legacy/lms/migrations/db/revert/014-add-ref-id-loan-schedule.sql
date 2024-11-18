-- Revert lms-lite:014-add-ref-id-loan-schedule from pg

BEGIN;

ALTER TABLE loan_schedule DROP COLUMN IF EXISTS ref_id;
ALTER TABLE journal ALTER COLUMN amount TYPE NUMERIC USING amount::NUMERIC;

COMMIT;
