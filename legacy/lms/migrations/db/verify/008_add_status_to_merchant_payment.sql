-- story id: CALM-108
DO $$
    BEGIN
        -- Check if 'status' column exists
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'merchant_payment'
              AND column_name = 'status'
        ) THEN
            RAISE EXCEPTION 'Column status does not exist in merchant_payment table';
        END IF;

        -- Check if 'status_timestamp' column exists
        IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'merchant_payment'
              AND column_name = 'status_timestamp'
        ) THEN
            RAISE EXCEPTION 'Column status_timestamp does not exist in merchant_payment table';
        END IF;
    END $$;