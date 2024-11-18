-- Revert lms-lite:017-adjust-loan-schedule-ref-length from pg

BEGIN;

ALTER TABLE public.loan_schedule ALTER COLUMN ref_id TYPE varchar(200) USING ref_id::varchar(200);

COMMIT;
