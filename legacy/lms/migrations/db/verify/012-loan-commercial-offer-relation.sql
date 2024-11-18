-- Verify lms-lite:012-loan-commercial-offer-relation on pg

DO $$
    BEGIN
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'loan'
              AND column_name = 'commercial_offer_id'
        ) AS column_exists;
    END $$;