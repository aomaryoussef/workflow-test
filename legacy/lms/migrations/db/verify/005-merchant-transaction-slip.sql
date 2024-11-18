-- Verify lms-lite:005-merchant-transaction-slip on pg
DO $$

BEGIN
	ASSERT(SELECT EXISTS (
				SELECT
				FROM pg_tables
				WHERE schemaname = 'public'
					AND tablename = 'merchant_transaction_slip'
				));

	ASSERT(SELECT EXISTS (
				SELECT
				FROM pg_tables
				WHERE schemaname = 'public'
					AND tablename = 'merchant_payment'
				));
END $$;
