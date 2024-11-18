CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE checkout_baskets
ADD COLUMN transaction_id BIGINT UNIQUE NOT NULL DEFAULT (
    (floor(random() * 9e15) + 1e15)::BIGINT
);
