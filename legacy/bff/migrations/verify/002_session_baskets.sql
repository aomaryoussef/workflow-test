-- Verify openloop-bff:session_baskets on pg

DO $$
BEGIN
   ASSERT(SELECT EXISTS (
				SELECT FROM pg_tables
				WHERE schemaname = 'bff'
					AND tablename = 'session_baskets'
				));
END $$;