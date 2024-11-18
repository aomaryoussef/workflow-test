BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.merchant_transaction_slip (
    id                          VARCHAR(50) PRIMARY KEY,
    loan_id                     VARCHAR(50) NOT NULL UNIQUE,
    order_number                VARCHAR(50) NOT NULL,   -- should come from the checkout basket order number
    merchant_account_id         VARCHAR(60) NOT NULL,   -- merchant_account_id to reference the global merchant key in financial account
    payable_units               BIGINT NOT NULL,
    payable_currency            VARCHAR(3) NOT NULL DEFAULT 'EGP',
    booking_time                TIMESTAMPTZ NOT NULL,
    narration_comment           VARCHAR(512),
    created_at                  TIMESTAMPTZ NOT NULL,
    cancelled_for_disbursement  BOOLEAN DEFAULT FALSE,  -- in case the loan is cancelled, this field will be updated
    CONSTRAINT fk_loan_id_loan FOREIGN KEY (loan_id) REFERENCES public.loan (id)
);

CREATE TABLE public.merchant_payment (
    id                    VARCHAR(50) PRIMARY KEY,
    created_at            TIMESTAMPTZ NOT NULL,

    -- GA api fields
    merchant_account_id   VARCHAR(60) NOT NULL,     -- merchant_account_id to reference the global merchant key in financial account
    integration_point     VARCHAR(20) NOT NULL,
    journal_name          VARCHAR(10) NOT NULL,
    account_type          VARCHAR(10) NOT NULL,
    invoice_number        VARCHAR NOT NULL,         -- invoice number generated for this payment
    payable_units         BIGINT NOT NULL,
    payable_currency      VARCHAR(3) NOT NULL DEFAULT 'EGP',
    transaction_date      TIMESTAMPTZ NOT NULL,     -- what should this be? each loan activation has a different date
    success_ga_posting    BOOLEAN NOT NULL DEFAULT FALSE,
    ga_posting_response   JSON
);

CREATE TABLE public.merchant_payment_transaction_slip (
    payment_id          VARCHAR(50) NOT NULL,
    transaction_slip_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (payment_id, transaction_slip_id),
    CONSTRAINT fk_payment_id_merchant_payment_transaction_slip FOREIGN KEY (payment_id) REFERENCES public.merchant_payment(id),
    CONSTRAINT fk_transaction_slip_id_merchant_payment_transaction_slip FOREIGN KEY (transaction_slip_id) REFERENCES public.merchant_transaction_slip(id)
);

COMMIT;