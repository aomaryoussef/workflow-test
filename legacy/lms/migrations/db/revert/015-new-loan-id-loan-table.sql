-- Revert lms-lite:015-new-loan-id-loan-table from pg

BEGIN;

ALTER TABLE public.loan
  DROP CONSTRAINT loan_new_loan_id_key;

ALTER TABLE public.loan
  DROP COLUMN new_loan_id;

COMMIT;
