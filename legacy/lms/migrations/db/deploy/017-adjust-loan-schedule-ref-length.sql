-- Deploy lms-lite:017-adjust-loan-schedule-ref-length to pg

BEGIN;

ALTER TABLE public.loan_schedule ALTER COLUMN ref_id TYPE varchar(300) USING ref_id::varchar(300);

COMMIT;
