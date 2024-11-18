-- Revert openloop-bff:session_baskets from pg

BEGIN;

DROP TABLE session_baskets;

COMMIT;
