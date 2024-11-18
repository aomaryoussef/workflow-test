-- Financial products are offered to the borrowers. Each financial product has a set of terms and conditions.
-- All financial products can be potentially offered to all borrowers across any merchants.
-- The selection of financial products is done outside of LMS using the product selector component that is
-- responsible for filtering the products based on the borrower's profile and the merchant's requirements or other
-- business rules.
CREATE TABLE financial_product (
    id                                  VARCHAR NOT NULL PRIMARY KEY,
    version                             INTEGER NOT NULL,
    created_at                          TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at                          TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by                          VARCHAR NOT NULL,
    updated_by                          VARCHAR NOT NULL,
    updated_by_event_id                 VARCHAR NOT NULL,
    state                               VARCHAR NOT NULL,
    name                                VARCHAR NOT NULL,
    description                         VARCHAR NOT NULL,
    active_since                        TIMESTAMP WITH TIME ZONE NOT NULL,
    active_until                        TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_in_days                INTEGER NOT NULL,
    min_principal_units                 INTEGER NOT NULL,
    min_principal_currency              VARCHAR(3) NOT NULL,
    max_principal_units                 INTEGER NOT NULL,
    max_principal_currency              VARCHAR(3) NOT NULL,
    min_down_payment_basis_points       INTEGER NOT NULL,
    max_down_payment_basis_points       INTEGER NOT NULL,
    vat_percent_basis_points            INTEGER NOT NULL,
    admin_fee_percent_basis_points      INTEGER NOT NULL,
    es_fee_percent_basis_points         INTEGER NOT NULL,
    bd_allowance_percent_basis_points   INTEGER NOT NULL,
    tenors                              JSONB NOT NULL,
    FOREIGN KEY (updated_by_event_id) REFERENCES event_log (id)
);

-- Loan accounts are created for the borrowers. Each loan account is associated with a financial product.
-- The loan account is the main table that holds the information about the loan account and the borrower.
CREATE TABLE loan_account (
    id                              VARCHAR NOT NULL PRIMARY KEY,
    version                         INTEGER NOT NULL,
    created_at                      TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at                      TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by                      VARCHAR NOT NULL,
    updated_by                      VARCHAR NOT NULL,
    updated_by_event_id             VARCHAR NOT NULL,
    state                           VARCHAR NOT NULL,
    sub_state                       VARCHAR NOT NULL,
    borrower_id                     VARCHAR NOT NULL,
    borrower_repayment_day_of_month INTEGER NOT NULL,
    commercial_offer_id             VARCHAR NOT NULL,
    financial_product_id            VARCHAR NOT NULL,
    financial_product_tenor_key     VARCHAR NOT NULL,
    tenor_days                      INTEGER NOT NULL,
    grace_period_in_days            INTEGER NOT NULL,
    booked_at                       TIMESTAMP WITH TIME ZONE NOT NULL,
    loan_start_date                 TIMESTAMP WITH TIME ZONE,
    loan_maturity_date              TIMESTAMP WITH TIME ZONE,
    merchant_id                     VARCHAR NOT NULL,
    lender_source                   VARCHAR NOT NULL,
    origination_channel             VARCHAR NOT NULL,
    applied_currency                VARCHAR(3) NOT NULL,
    -- flat rate
    fr_basis_points                 INTEGER NOT NULL,
    -- monthly effective rate
    monthly_effective_rate          DOUBLE PRECISION NOT NULL,
    -- total effective rate over the loan tenure
    total_effective_rate            DOUBLE PRECISION NOT NULL,
    -- annual percentage rate
    annual_percent_rate             DOUBLE PRECISION NOT NULL,
    vat_basis_points                INTEGER NOT NULL,
    admin_fee_basis_points          INTEGER NOT NULL,
    es_fee_basis_points             INTEGER NOT NULL,
    bd_allowance_basis_points       INTEGER NOT NULL,
    -- rounding up estimated gain
    rounding_up_est_gain_units      INTEGER NOT NULL,
    FOREIGN KEY (updated_by_event_id) REFERENCES event_log (id)
);
CREATE INDEX idx__loan_account__state ON loan_account USING btree (state);
CREATE INDEX idx__loan_account__sub_state ON loan_account USING btree (sub_state);
CREATE INDEX idx__loan_account__financial_product_id ON loan_account USING btree (financial_product_id);
CREATE INDEX idx__loan_account__financial_product_tenor_key ON loan_account USING btree (financial_product_tenor_key);
CREATE INDEX idx__loan_account__commercial_offer_id ON loan_account USING btree (commercial_offer_id);
CREATE INDEX idx__loan_account__merchant_id ON loan_account USING btree (merchant_id);
CREATE INDEX idx__loan_account__borrower_id ON loan_account USING btree (borrower_id);
CREATE INDEX idx__loan_account__booked_at ON loan_account USING btree (booked_at);
CREATE INDEX idx__loan_account__origination_channel ON loan_account USING btree (origination_channel);
CREATE INDEX idx__loan_account__lender_source ON loan_account USING btree (lender_source);


CREATE TABLE loan_account_ammortisation_line_item (
    loan_account_id                VARCHAR NOT NULL,
    line_item_sequence             INTEGER NOT NULL,
    installment_due_date           TIMESTAMP WITH TIME ZONE NOT NULL,
    grace_period_ends_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    loan_balance_units             BIGINT NOT NULL,
    principal_due_units            BIGINT NOT NULL,
    interest_due_units             BIGINT NOT NULL,
    cumulative_interest_units      BIGINT NOT NULL,
    vat_due_units                  BIGINT NOT NULL,
    admin_fee_due_units            BIGINT NOT NULL,
    penalty_due_units              BIGINT NOT NULL,
    total_due_units                BIGINT NOT NULL,
    revenue_recognition_job_id     BIGINT NOT NULL,
    canceled                       BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at                    TIMESTAMP WITH TIME ZONE,
    canceled_reason                VARCHAR,
    principal_paid_units           BIGINT NOT NULL DEFAULT 0,
    interest_paid_units            BIGINT NOT NULL DEFAULT 0,
    vat_paid_units                 BIGINT NOT NULL DEFAULT 0,
    admin_fee_paid_units           BIGINT NOT NULL DEFAULT 0,
    penalty_paid_units             BIGINT NOT NULL DEFAULT 0,
    total_paid_units               BIGINT NOT NULL DEFAULT 0,
    created_at                     TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (loan_account_id, line_item_sequence),
    FOREIGN KEY (loan_account_id) REFERENCES loan_account (id)
);

-- The monetary line items are the line items that are associated with the loan account,
-- such as the principal, VAT, admin fee, etc., that are the line items associated with the loan account.
-- The table also specifies how those line items are collected, e.g. VAT - collected by merchant
-- In future this can also allow us to have other collection strategies, e.g. VAT - ammortised over the loan tenure.
CREATE TABLE loan_account_monetary_line_item (
    loan_account_id     VARCHAR NOT NULL,
    type                VARCHAR NOT NULL,
    collection_type     VARCHAR NOT NULL,
    amount_units        BIGINT NOT NULL,
    PRIMARY KEY (loan_account_id, type),
    FOREIGN KEY (loan_account_id) REFERENCES loan_account (id)
);

CREATE INDEX idx__loan_account_monetary_line_item__type ON loan_account_monetary_line_item USING btree (type);

-- The loan account payment table records the payments that are made to the loan account.
-- This table links the payment or part of the payment with payment_id to a specific ammortisation line item.
-- This means using this table structure we can support partial repayments as well.
CREATE TABLE loan_account_payment (
    loan_account_id                     VARCHAR NOT NULL,
    payment_reference_id                VARCHAR NOT NULL,
    ammortisation_line_item_sequence    INTEGER NOT NULL,
    booked_at                           TIMESTAMP WITH TIME ZONE NOT NULL,
    applied_currency                    VARCHAR(3) NOT NULL,
    paid_units                          BIGINT NOT NULL,
    updated_by_event_id                 VARCHAR NOT NULL,
    PRIMARY KEY (loan_account_id, payment_reference_id, ammortisation_line_item_sequence),
    FOREIGN KEY (loan_account_id) REFERENCES loan_account (id),
    FOREIGN KEY (updated_by_event_id) REFERENCES event_log (id)
);

CREATE TABLE loan_account_early_settlement (
     loan_account_id            VARCHAR NOT NULL PRIMARY KEY REFERENCES loan_account (id),
     applied_currency           VARCHAR(3) NOT NULL,
     available                  BOOLEAN NOT NULL,
     principal_due_units        BIGINT,
     interest_receivable_units  BIGINT,
     settlement_fee_units       BIGINT,
     updated_by_event_id        VARCHAR NOT NULL,
     FOREIGN KEY (updated_by_event_id) REFERENCES event_log (id)
);


CREATE TYPE journal_direction AS ENUM ('DEBIT', 'CREDIT');
CREATE TABLE journal (
    id                  BIGSERIAL PRIMARY KEY,
    linked_entity_id    VARCHAR NOT NULL,
    linked_entity_type  VARCHAR NOT NULL,
    lender_source       VARCHAR NOT NULL,
    event_id            VARCHAR NOT NULL REFERENCES event_log (id),
    event_type          VARCHAR NOT NULL,
    transaction_group   INTEGER NOT NULL,
    cost_center         VARCHAR NOT NULL,
    account             VARCHAR NOT NULL,
    sub_account         VARCHAR NOT NULL,
    direction           journal_direction NOT NULL,
    amount              BIGINT NOT NULL,
    booked_at           TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE (event_id, transaction_group, cost_center, account, sub_account, direction)
);


CREATE TABLE gl_reconciliation (
    linked_entity_id           VARCHAR NOT NULL,
    linked_entity_type         VARCHAR NOT NULL,
    event_id                   VARCHAR NOT NULL REFERENCES event_log (id),
    event_type                 VARCHAR NOT NULL,
    transaction_date           BIGINT NOT NULL,
    processed_job_id           BIGINT NOT NULL,
    raw_request                JSONB NOT NULL,
    raw_response               JSONB NOT NULL,
    PRIMARY KEY (linked_entity_id, event_id)
);