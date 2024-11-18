-- Revert lms-lite:004-party-accounts from pg

BEGIN;

DROP TABLE public.party_account;
DROP TYPE public.party_account_type;

COMMIT;
