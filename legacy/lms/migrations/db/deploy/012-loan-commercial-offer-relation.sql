-- Deploy lms-lite:012-loan-commercial-offer-relation to pg

BEGIN;

-- XXX Add DDLs here.
  ALTER TABLE loan ADD COLUMN commercial_offer_id VARCHAR NULL;
  ALTER TABLE loan DROP COLUMN admin_fee;

COMMIT;
