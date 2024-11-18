DO $$

BEGIN
	ASSERT(SELECT EXISTS (
				SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='merchant_transaction_slip' and column_name='updated_at'));
END $$;
