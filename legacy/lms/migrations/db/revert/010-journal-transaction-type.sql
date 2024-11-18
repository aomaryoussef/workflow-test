-- Revert lms-lite:010-journal-transaction-type from pg

BEGIN;

ALTER TABLE public.journal
  DROP COLUMN type;

COMMIT;
