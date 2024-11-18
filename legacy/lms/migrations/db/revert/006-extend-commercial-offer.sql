BEGIN;

ALTER TABLE public.commercial_offer
  DROP COLUMN financial_product_key,
  DROP COLUMN financial_product_version;

COMMIT;