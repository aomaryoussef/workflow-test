-- story id: CALM-122
DO $$ BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'merchant_transaction_slip'
          AND column_name = 'merchant_payment_id'
    ) OR EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_name = 'merchant_transaction_slip'
          AND constraint_name = 'fk_merchant_payment_id_merchant_transaction_slip'
    ) THEN
        RAISE EXCEPTION 'Revert of nullable foreign key column not applied correctly';
    END IF;
END $$;