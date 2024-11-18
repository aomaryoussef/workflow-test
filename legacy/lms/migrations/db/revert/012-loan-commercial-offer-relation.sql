-- Revert lms-lite:012-loan-commercial-offer-relation from pg

BEGIN;

-- XXX Add DDLs here.
  ALTER TABLE loan DROP COLUMN IF EXISTS commercial_offer_id;
  ALTER TABLE loan ADD COLUMN admin_fee BIGINT NOT NULL DEFAULT 0;

COMMIT;
