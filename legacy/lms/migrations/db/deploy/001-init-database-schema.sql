-- Deploy lms-lite:001-init-database-schema to pg

BEGIN;

CREATE TABLE public.loan
(
    id                        VARCHAR(50) NOT NULL PRIMARY KEY, -- primary key, lexicographically sorted uid
    financial_product_key     VARCHAR(50) NOT NULL,             -- financial product key
    financial_product_version VARCHAR(50) NOT NULL,             -- financial product version
    --linked_party_account_id   VARCHAR(50) NOT NULL,           -- linked party account id
    correlation_id            VARCHAR(50) NOT NULL,             -- when activating the loan, the unique reference id of the workflow
    admin_fee                 BIGINT NOT NULL,
    booked_at                 TIMESTAMPTZ NOT NULL,
    created_at                TIMESTAMPTZ NOT NULL,
    created_by                VARCHAR(50) NOT NULL
);

CREATE TABLE public.loan_status
(
    loan_id     VARCHAR(50) NOT NULL,
    status      VARCHAR(50) NOT NULL,   -- status
    created_at  TIMESTAMPTZ NOT NULL,
    CONSTRAINT pk_loan_status PRIMARY KEY (loan_id, status),
    CONSTRAINT fk_loan_status_loan_id FOREIGN KEY(loan_id) REFERENCES public.loan(id)
);

CREATE TABLE public.loan_schedule
(
    id                         SERIAL PRIMARY KEY, -- primary key, lexicographically sorted
    loan_id                    VARCHAR(50) NOT NULL,
    due_date                   TIMESTAMPTZ NOT NULL,
    loan_balance               BIGINT      NOT NULL,
    grace_period_end_date      TIMESTAMPTZ NOT NULL,
    paid_date                  TIMESTAMPTZ NULL,
    
    due_principal              BIGINT      NOT NULL,
    due_interest               BIGINT      NOT NULL,
    due_late_fee               BIGINT      NULL,

    paid_principal             BIGINT      NULL,
    paid_interest              BIGINT      NULL,
    paid_late_fee              BIGINT      NULL,
    
    created_at                 TIMESTAMPTZ NOT NULL,
    created_by                 VARCHAR     NOT NULL,
    updated_at                 TIMESTAMPTZ NULL,
    updated_by                 VARCHAR     NULL,
    CONSTRAINT fk_loan_schedule_loan_id FOREIGN KEY(loan_id) REFERENCES public.loan(id)
);


CREATE TYPE journal_direction AS ENUM ('DEBIT', 'CREDIT');

CREATE TABLE public.journal (
    id SERIAL PRIMARY KEY,
    -- Metadata fields (may be some of the fields might not be needed)
    -- correlation_id is a globally unique identifier which maps to the request that enabled this entry
    correlation_id VARCHAR NOT NULL,
    account VARCHAR NOT NULL,
    direction journal_direction NOT NULL,
    amount NUMERIC NOT NULL,
    booked_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    transaction_id INT NOT NULL,
    loan_id VARCHAR(50) NOT NULL REFERENCES public.loan (id)
);

COMMIT;