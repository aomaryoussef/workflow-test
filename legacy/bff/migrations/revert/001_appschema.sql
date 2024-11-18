-- Revert openloop-bff:appschema from pg

BEGIN;

DROP SCHEMA bff;
-- XXX Add DDLs here.

COMMIT;
