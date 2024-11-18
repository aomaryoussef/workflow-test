DO $$

BEGIN
	ASSERT(SELECT EXISTS (
				SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='commercial_offer' and column_name='financial_product_key'));
END $$;
