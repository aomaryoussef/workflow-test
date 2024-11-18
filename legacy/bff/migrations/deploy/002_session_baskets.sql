-- Deploy op-bff:session_baskets to pg

BEGIN;

CREATE TABLE bff.session_baskets (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null,
  branch_id uuid,
  cashier_id uuid not null,
  consumer_id uuid,
  partner_name character varying not null,
  status character varying not null,
  cart_code int not null,
  products jsonb not null,
  cashier_device_info jsonb,
  consumer_device_info jsonb,
  created_at timestamp not null default current_timestamp,
  updated_at timestamp not null default current_timestamp
);

CREATE INDEX index_session_baskets_on_partner_id on bff.session_baskets(partner_id);
CREATE INDEX index_session_baskets_on_consumer_id on bff.session_baskets(consumer_id);
CREATE INDEX index_session_baskets_on_cart_code on bff.session_baskets(cart_code);

COMMIT;