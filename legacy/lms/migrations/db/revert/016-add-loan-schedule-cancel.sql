-- Revert lms-lite:016-add-loan-schedule-cancel from pg

BEGIN;

ALTER TABLE public.loan_schedule
    DROP COLUMN is_cancelled;

COMMIT;
