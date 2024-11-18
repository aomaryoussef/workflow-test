DO $$

BEGIN
	ASSERT(SELECT EXISTS (
				SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='journal_voucher_entries' and column_name='journal_id'));
END $$;