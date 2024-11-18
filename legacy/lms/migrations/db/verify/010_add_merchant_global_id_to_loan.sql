-- story id: CALM-122
DO $$BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'loan'
          AND column_name = 'merchant_global_id'
    ) AS column_exists;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'merchant_payment_transaction_slip') THEN
        RAISE EXCEPTION 'Table merchant_payment_transaction_slip still exists';
    END IF;
END $$;