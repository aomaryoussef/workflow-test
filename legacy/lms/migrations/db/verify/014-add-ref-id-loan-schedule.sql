-- Verify lms-lite:014-add-ref-id-loan-schedule on pg

BEGIN;

DO $$

  BEGIN
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'loan_schedule'
        AND column_name = 'ref_id'
    ) AS column_exists;

    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'journal'
        AND column_name = 'amount'
        AND data_type = 'bigint'
    ) AS column_exists;
  END $$;

ROLLBACK;
