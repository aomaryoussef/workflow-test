CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS public.paymob_audit
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    transaction_id bigint NOT NULL,
    request jsonb NOT NULL,
    response jsonb NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_d3ad4585b7bae6dc8b5accbe770" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.paymob_session_baskets
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    transaction_id integer,
    terminal_id character varying COLLATE pg_catalog."default" NOT NULL,
    product_price numeric(10,2) NOT NULL,
    down_payment numeric(10,2),
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT "PK_1d32d748f6911d2167c04f883e0" PRIMARY KEY (id)
);
