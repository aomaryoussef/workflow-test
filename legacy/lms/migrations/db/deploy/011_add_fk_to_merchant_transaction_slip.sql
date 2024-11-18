-- story id: CALM-122
BEGIN;
    ALTER TABLE public.merchant_transaction_slip ADD COLUMN merchant_payment_id character varying(50);
    ALTER TABLE public.merchant_transaction_slip
        ADD CONSTRAINT fk_merchant_payment_id_merchant_transaction_slip
            FOREIGN KEY (merchant_payment_id)
                REFERENCES public.merchant_payment (id)
                    MATCH SIMPLE
                ON UPDATE NO ACTION
                ON DELETE NO ACTION
                DEFERRABLE INITIALLY DEFERRED;
COMMIT;