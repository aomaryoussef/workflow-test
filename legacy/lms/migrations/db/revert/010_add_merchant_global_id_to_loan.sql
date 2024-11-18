-- story id: CALM-122
BEGIN;
    ALTER TABLE loan DROP COLUMN IF EXISTS merchant_global_id;

CREATE TABLE IF NOT EXISTS merchant_payment_transaction_slip (
 payment_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
 transaction_slip_id character varying(50) COLLATE pg_catalog."default" NOT NULL,
 CONSTRAINT merchant_payment_transaction_slip_pkey PRIMARY KEY (payment_id, transaction_slip_id),
 CONSTRAINT fk_payment_id_merchant_payment_transaction_slip FOREIGN KEY (payment_id)
     REFERENCES public.merchant_payment (id) MATCH SIMPLE
     ON UPDATE NO ACTION
     ON DELETE NO ACTION,
 CONSTRAINT fk_transaction_slip_id_merchant_payment_transaction_slip FOREIGN KEY (transaction_slip_id)
     REFERENCES public.merchant_transaction_slip (id) MATCH SIMPLE
     ON UPDATE NO ACTION
     ON DELETE NO ACTION
);

COMMIT;