-- Revert lms-lite:001-init-database-schema from pg

BEGIN;

DROP TABLE public.loan_schedule;
DROP TABLE public.loan_status;

DROP TABLE public.journal;
DROP TYPE public.journal_direction;

DROP TABLE public.loan;

COMMIT;
