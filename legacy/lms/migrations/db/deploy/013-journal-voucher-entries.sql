-- Deploy lms-lite:013-journal-voucher-entries to pg

BEGIN;

-- New connector table to not break the journal's append-only nature
-- This table can be fully separated from LMS core capabilities hence no foreign keys!
-- As connection is redundant with this table, no foreign key is needed
-- (content can be recalculated anytime based on date start - end!)
CREATE TABLE journal_voucher_entries (
  journal_entry_id    INT UNIQUE,
  journal_voucher_id  VARCHAR,
  correlation_id      VARCHAR,
  created_at          TIMESTAMPTZ NOT NULL,
  created_by          VARCHAR     NOT NULL,
  updated_at          TIMESTAMPTZ NULL,
  updated_by          VARCHAR     NULL
);

COMMIT;
