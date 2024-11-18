-- Verify lms-lite:009-clean-up-merchant-disbursements on pg

BEGIN;

-- XXX Add verifications here.
ASSERT(SELECT EXISTS (
				SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='merchant_payment' and column_name='serial_id'));

ROLLBACK;
