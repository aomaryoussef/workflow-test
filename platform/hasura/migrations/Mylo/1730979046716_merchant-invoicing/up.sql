CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table if not exists public.invoicing_transaction
(
    id                     uuid                        default uuid_generate_v4() not null
        constraint "PK_invoicing_transaction_id" primary key,
    reference_id           varchar(50)                                            not null,
    payment_account_id     varchar(50)                                            not null,
    payment_connector_type varchar(50)                                            not null,
    payable_units          bigint                                                 not null,
    payable_currency       varchar(10)                                            not null,
    narration_comment      varchar(150)                                           not null,
    transaction_date       timestamp(0) with time zone                            not null,
    created_at             timestamp(0) with time zone default now()              not null,
    updated_at             timestamp(0) with time zone default now()              not null
);

--For reading the status of a specific loan
create index if not exists "IDX_invoicing_transaction_reference_id"
    on public.invoicing_transaction (reference_id);

--For aggregation of invoices per time range
create index if not exists "IDX_invoicing_transaction_date"
    on public.invoicing_transaction (transaction_date);

create table  if not exists public.merchant_payment
(

    id                     uuid                        default uuid_generate_v4() not null
        constraint "PK_merchant_payment_id" primary key,
    payment_account_id     varchar(50)                                            not null,
    payment_connector_type varchar(50)                                            not null,
    payable_units          bigint                                                 not null,
    payable_currency       varchar(10)                                            not null,
    created_at             timestamp(0) with time zone default now()              not null,
    updated_at             timestamp(0) with time zone default now()              not null,
    sequence_id            bigserial
);

--For invoice status updates queries
create index  if not exists "IDX_merchant_payment_sequence_id"
    on public.merchant_payment (sequence_id);

create table  if not exists public.merchant_payment_invoicing_transactions
(
    merchant_payment_id      uuid not null
        constraint "FK_merchant_payment_id"
            references public.merchant_payment
            on update cascade on delete cascade,
    invoicing_transaction_id uuid not null
        constraint "FK_invoicing_transaction_id"
            references public.invoicing_transaction
            on update cascade on delete cascade,
    constraint "PK_merchant_payment_invoicing_transactions"
        primary key (merchant_payment_id, invoicing_transaction_id)
);

--For aggregation of invoices to check for non paid transactions
create index  if not exists "IDX_merchant_payment_id"
    on public.merchant_payment_invoicing_transactions (merchant_payment_id);

--For aggregation of invoices to check for non paid transactions
create index  if not exists "IDX_invoicing_transaction_id"
    on public.merchant_payment_invoicing_transactions (invoicing_transaction_id);

create table  if not exists public.merchant_payment_status_logs
(
    id          uuid                        default uuid_generate_v4() not null
        constraint "PK_merchant_payment_status_logs_id" primary key,
    payment_id  uuid                                                   not null
        constraint "FK_merchant_payment_id" references public.merchant_payment,
    status      varchar(50)                                            not null,
    status_date timestamp(0) with time zone                            not null,
    created_at  timestamp(0) with time zone default now()              not null,
    updated_at  timestamp(0) with time zone default now()              not null
);