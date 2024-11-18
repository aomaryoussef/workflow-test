-- Deploy lms-lite:002-audit-entries to pg

BEGIN;

CREATE TABLE public.command (
    id SERIAL PRIMARY KEY,
    command_type VARCHAR NOT NULL,
    consumer_id VARCHAR NOT NULL,
    correlation_id VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE public.entry (
    id BIGSERIAL PRIMARY KEY,
    command_id INTEGER NOT NULL REFERENCES public.command (id),
    entry_type VARCHAR NOT NULL,
    amount BIGINT NOT NULL
);

COMMIT;