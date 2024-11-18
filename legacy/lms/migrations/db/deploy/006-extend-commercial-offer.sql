BEGIN;

ALTER TABLE public.commercial_offer
  ADD COLUMN financial_product_key VARCHAR NOT NULL DEFAULT 'test-financial-product,',
  ADD COLUMN financial_product_version VARCHAR NOT NULL DEFAULT '1';

COMMIT;