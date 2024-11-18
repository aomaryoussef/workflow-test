-- Revert lms-lite:013-journal-voucher-entries from pg

BEGIN;

DROP TABLE journal_voucher_entries;

COMMIT;
