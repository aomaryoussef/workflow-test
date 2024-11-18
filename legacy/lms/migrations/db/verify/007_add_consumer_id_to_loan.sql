
-- story id: CALM-107
DO $$

    BEGIN
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'loan'
              AND column_name = 'consumer_id'
        ) AS column_exists;
    END $$;