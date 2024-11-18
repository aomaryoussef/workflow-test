-- Revert lms-lite:002-audit-entries from pg

BEGIN;

DROP TABLE public.entry;
DROP TABLE public.command;

COMMIT;
