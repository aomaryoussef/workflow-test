-- Deploy lms-lite:016-add-loan-schedule-cancel to pg

BEGIN;

ALTER TABLE public.loan_schedule
    ADD is_cancelled BOOLEAN DEFAULT FALSE NOT NULL;

COMMIT;
