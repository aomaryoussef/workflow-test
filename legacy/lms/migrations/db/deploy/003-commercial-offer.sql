BEGIN;

CREATE TABLE public.commercial_offer (
    id VARCHAR PRIMARY KEY,
    consumer_id VARCHAR NOT NULL,
    basket_id VARCHAR NOT NULL,
    tenure VARCHAR NOT NULL,
    admin_fee BIGINT NOT NULL,
    financed_amount BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    down_payment BIGINT NOT NULL,
    monthly_instalment BIGINT NOT NULL,
    interest_rate_per_tenure VARCHAR NOT NULL,
    annual_interest_percentage VARCHAR NOT NULL,
    consumer_accepted_at TIMESTAMPTZ NULL,
    merchant_acccepted_at TIMESTAMPTZ NULL
);

COMMIT;