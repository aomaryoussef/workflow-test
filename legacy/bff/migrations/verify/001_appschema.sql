-- Verify openloop-bff:appschema on pg

DO $$
BEGIN
   ASSERT (SELECT has_schema_privilege('bff', 'usage'));
END $$;