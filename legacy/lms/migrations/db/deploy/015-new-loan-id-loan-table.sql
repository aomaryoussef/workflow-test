-- Deploy lms-lite:015-new-loan-id-loan-table to pg

BEGIN;

ALTER TABLE public.loan
    ADD new_loan_id VARCHAR(25);

ALTER TABLE public.loan
    ADD CONSTRAINT loan_new_loan_id_key UNIQUE (new_loan_id);

COMMIT;
