-- Verify lms-lite:004-party-accounts from pg

BEGIN;

ASSERT(
	SELECT EXISTS (
			SELECT
			FROM pg_tables
			WHERE schemaname = 'public'
				AND tablename = 'party_account'
		)
);

ROLLBACK;
