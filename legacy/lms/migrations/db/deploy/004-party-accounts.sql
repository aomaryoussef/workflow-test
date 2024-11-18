-- Deploy lms-lite:004-party-accounts to pg
BEGIN;

CREATE TYPE public.party_account_type AS ENUM ('INDIVIDUAL_ACCOUNT', 'MERCHANT_ACCOUNT');

CREATE TABLE IF NOT EXISTS public.party_account (
  id SERIAL PRIMARY KEY,
  global_reference_id VARCHAR(50) NOT NULL UNIQUE,
  account_type party_account_type NOT NULL,
  account_status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

COMMIT;