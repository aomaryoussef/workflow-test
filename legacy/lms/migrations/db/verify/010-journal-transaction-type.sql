-- Verify lms-lite:010-journal-transaction-type on pg

BEGIN;

ASSERT(SELECT EXISTS (
				SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='journal' and column_name='type'));

ROLLBACK;
