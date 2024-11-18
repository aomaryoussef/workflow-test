-- Deploy lms-lite:010-journal-transaction-type to pg

BEGIN;

ALTER TABLE public.journal
  ADD COLUMN type VARCHAR NOT NULL DEFAULT 'OTHER';

COMMIT;
