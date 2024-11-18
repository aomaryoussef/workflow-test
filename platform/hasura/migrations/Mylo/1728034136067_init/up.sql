SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bankname') THEN
        CREATE TYPE public.bankname AS ENUM (
            'CIB', 'NBE', 'MISR', 'BDC', 'AAIB', 'FAIB', 'BOA', 'ADIB', 'ADCB', 'ARAB', 'CAE', 'HSBC', 
            'QNB', 'SCB', 'EGB', 'HDB', 'UB', 'EBE', 'ABK', 'AUB', 'AGB', 'AI', 'BBE', 'ARIB', 'SC', 
            'EALB', 'NBK', 'ABC', 'FAB', 'MIDB', 'IDB', 'MASH', 'ENBD', 'SAIB', 'AIB', 'ABRK', 'NBG', 
            'NSB', 'PDAC', 'POST');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'checkoutbasketstatus') THEN
        CREATE TYPE public.checkoutbasketstatus AS ENUM (
            'CREATED', 'COMMERCIAL_OFFERS_GENERATED', 'RISK_CHECK_FAILED', 'COMMERCIAL_OFFERS_FAILURE',
            'LOAN_ACTIVATED', 'LOAN_ACTIVATION_FAILURE', 'COMMERCIAL_OFFER_SELECTED', 'DOWN_PAYMENT_ACCEPTED',
            'FAILURE', 'CANCELLED_BY_CASHIER', 'CANCELLED_BY_CONSUMER', 'CREDIT_LIMIT_UPDATE_FAILURE',
            'IN_ACTIVE_CONSUMER_FAILURE', 'IN_PROGRESS_CHECKOUT_FOUND_FAILURE', 'NO_GENERATED_COMMERCIAL_OFFERS_FAILURE',
            'NO_COMMERCIAL_OFFER_SELECTED_FAILURE', 'OTP_SEND_FAILURE', 'OTP_VERIFICATION_FAILURE', 'IN_ACTIVE_PARTNER_FAILURE');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'consumerstatus') THEN
        CREATE TYPE public.consumerstatus AS ENUM (
            'AWAITING_ACTIVATION', 'ACTIVE', 'BLOCKED', 'WAITING_LIST', 'REJECTED', 'DEACTIVATED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currencycode') THEN
        CREATE TYPE public.currencycode AS ENUM ('EGP');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'governorate') THEN
        CREATE TYPE public.governorate AS ENUM ('ASSIUT', 'QENA', 'SOHAG');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'marital_status') THEN
        CREATE TYPE public.marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partnercategory') THEN
        CREATE TYPE public.partnercategory AS ENUM (
            'ELECTRONICS', 'FASHION', 'FURNITURE', 'CERAMICS_AND_SANITARY_WARE', 'AUTO_SPARE_PARTS', 'BABY_AND_TOYS',
            'JEWELRY', 'SUPERMARKETS', 'EVENT_PLANNING', 'EDUCATION', 'MOTORCYCLES', 'HOME_WARE', 'TOURISM_AND_ENTERTAINMENT',
            'MEDICAL', 'ACCESSORIES', 'WEDDING_HALLS', 'OPTICS', 'SPORTS', 'FINISHING', 'MOBILE', 'SHOPPING_HUBS');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partnerstatus') THEN
        CREATE TYPE public.partnerstatus AS ENUM ('ACTIVE', 'DISABLED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payeeidtype') THEN
        CREATE TYPE public.payeeidtype AS ENUM ('EMAIL', 'GLOBAL_UID');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payeetype') THEN
        CREATE TYPE public.payeetype AS ENUM ('CONSUMER', 'MERCHANT');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paymentchannel') THEN
        CREATE TYPE public.paymentchannel AS ENUM ('BTECH_STORE', 'FAWRY');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paymentstatus') THEN
        CREATE TYPE public.paymentstatus AS ENUM ('CREATED', 'PROCESSING', 'PROCESSED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'profiletype') THEN
        CREATE TYPE public.profiletype AS ENUM ('CASHIER', 'ADMIN', 'BRANCH_MANAGER');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sanction_type') THEN
        CREATE TYPE public.sanction_type AS ENUM ('SANCTION_LIST', 'TERRORIST_LIST');
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'areas_id_seq') THEN
        CREATE SEQUENCE public.areas_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'beta_consumers_id_seq') THEN
        CREATE SEQUENCE public.beta_consumers_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'car_models_id_seq') THEN
        CREATE SEQUENCE public.car_models_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'checkout_baskets') THEN
        CREATE TABLE public.checkout_baskets (
            id uuid NOT NULL,
            workflow_id uuid,
            partner_id uuid NOT NULL,
            cashier_id uuid NOT NULL,
            branch_id uuid NOT NULL,
            consumer_id uuid NOT NULL,
            session_basket_id uuid NOT NULL,
            status public.checkoutbasketstatus NOT NULL,
            products jsonb NOT NULL,
            gross_basket_value integer NOT NULL,
            commercial_offers jsonb,
            selected_commercial_offer_id uuid,
            consumer_device_metadata jsonb NOT NULL,
            loan_id uuid,
            category character varying(200),
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            transaction_id bigint DEFAULT ((floor((random() * ('9000000000000000'::numeric)::double precision)) + ('1000000000000000'::numeric)::double precision))::bigint NOT NULL,
            origination_channel character varying(255)
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'cities_id_seq') THEN
        CREATE SEQUENCE public.cities_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clubs') THEN
        CREATE TABLE public.clubs (
            id integer NOT NULL,
            name_en character varying(255) NOT NULL,
            name_ar character varying(255) NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clubs_id_seq') THEN
        CREATE SEQUENCE public.clubs_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_address') THEN
        CREATE TABLE public.consumer_address (
            id uuid NOT NULL,
            consumer_id uuid,
            description character varying(255),
            is_primary boolean NOT NULL,
            is_active boolean NOT NULL,
            governorate_id integer,
            city_id integer,
            area_id integer,
            address_line_1 character varying(50),
            address_line_2 character varying(50),
            address_line_3 character varying(50),
            postcode character varying(50),
            latitude double precision,
            longitude double precision,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_application') THEN
        CREATE TABLE public.consumer_application (
            id uuid NOT NULL,
            consumer_id uuid,
            phone_number_e164 character varying(50) NOT NULL,
            data json,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL,
            updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            updated_by character varying(100)
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_application_state') THEN
        CREATE TABLE public.consumer_application_state (
            id uuid NOT NULL,
            consumer_application_id uuid,
            state character varying(50),
            active_since timestamp(0) with time zone NOT NULL,
            created_at timestamp(0) without time zone DEFAULT (now()) NOT NULL,
            created_by character varying(100) NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_credit_limits') THEN
        CREATE TABLE public.consumer_credit_limits (
            id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
            consumer_id uuid NOT NULL,
            max_credit_limit integer NOT NULL,
            available_credit_limit integer NOT NULL,
            active_since timestamp(0) with time zone NOT NULL,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            updated_at timestamp(0) without time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_house_type_id_seq') THEN
        CREATE SEQUENCE public.consumer_house_type_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_house_type') THEN
        CREATE TABLE public.consumer_house_type (
            id integer NOT NULL,
            name_en character varying(255),
            name_ar character varying(255),
            unique_identifier character varying(255),
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_kyc') THEN
        CREATE TABLE public.consumer_kyc (
            id uuid NOT NULL,
            consumer_id uuid NOT NULL,
            national_id character varying(20),
            job_title character varying(100),
            work_type character varying(100),
            company_name character varying(100),
            other_company_name character varying(100),
            job_level character varying(50),
            education_level character varying(50),
            primary_income integer,
            additional_income integer,
            car_year integer,
            car_model character varying(50),
            marital_status character varying(50),
            house_level character varying(50),
            club character varying(50),
            dependants integer DEFAULT 0,
            active_since timestamp(0) with time zone NOT NULL,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL,
            updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            updated_by character varying(100),
            single_payment_day integer DEFAULT 1
        );
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_marital_status') THEN
        CREATE TABLE public.consumer_marital_status (
            id integer NOT NULL,
            name_ar character varying(255) NOT NULL,
            name_en character varying(255) NOT NULL,
            status public.marital_status NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_marital_status_id_seq') THEN
        CREATE SEQUENCE public.consumer_marital_status_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_phone') THEN
        CREATE TABLE public.consumer_phone (
            id uuid NOT NULL,
            consumer_id uuid,
            phone_number_e164 character varying(50) NOT NULL,
            is_primary boolean NOT NULL,
            is_active boolean NOT NULL,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_state') THEN
        CREATE TABLE public.consumer_state (
            id uuid NOT NULL,
            consumer_id uuid,
            state character varying(50) NOT NULL,
            active_since timestamp(0) with time zone NOT NULL,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL,
            comment text,
            branch character varying
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_used_credit_limits') THEN
        CREATE TABLE public.consumer_used_credit_limits (
            id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
            consumer_id uuid NOT NULL,
            used_credit integer NOT NULL,
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            updated_at timestamp with time zone DEFAULT now()
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_user_details') THEN
        CREATE TABLE public.consumer_user_details (
            id uuid NOT NULL,
            consumer_id uuid,
            first_name character varying(50) NOT NULL,
            email character varying(50),
            middle_name character varying(50),
            last_name character varying(50),
            national_id character varying(20),
            date_of_birth date,
            city_of_birth character varying(50),
            nationality character varying(50),
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL,
            updated_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            updated_by character varying(100)
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumers') THEN
        CREATE TABLE public.consumers (
            id uuid NOT NULL,
            phone_number character varying(20) NOT NULL,
            status public.consumerstatus NOT NULL,
            iam_id character varying,
            full_name character varying,
            first_name character varying,
            last_name character varying,
            national_id character varying,
            job_name character varying,
            work_type character varying,
            company character varying,
            club character varying,
            house_type character varying,
            city character varying,
            district character varying,
            governorate character varying,
            salary numeric,
            additional_salary numeric,
            address_description text,
            guarantor_job character varying,
            guarantor_relationship character varying,
            car_year integer,
            marital_status character varying,
            address text,
            activated_at timestamp without time zone NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            single_payment_day integer DEFAULT 1 NOT NULL,
            origination_channel character varying DEFAULT 'minicash'::character varying NOT NULL,
            additional_salary_source text,
            work_phone_number character varying(20),
            home_phone_number character varying(20),
            company_address text,
            national_id_address text,
            classification character varying DEFAULT 'NA'::character varying,
            activated_by_iam_id character varying,
            activation_branch character varying
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_credit_limits') THEN
        CREATE TABLE public.consumer_credit_limits (
            id uuid NOT NULL,
            consumer_id uuid NOT NULL,
            value integer NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'governorates') THEN
        CREATE TABLE public.governorates (
            id integer NOT NULL,
            mc_id integer,
            name_ar character varying(255) NOT NULL,
            name_en character varying(255) NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'governorates_id_seq') THEN
        CREATE SEQUENCE public.governorates_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'jobs') THEN
        CREATE TABLE public.jobs (
            id integer NOT NULL,
            name_en character varying(255) NOT NULL,
            name_ar character varying(255) NOT NULL,
            unique_identifier character varying(255) NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'jobs_id_seq') THEN
        CREATE SEQUENCE public.jobs_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'new_consumers') THEN
        CREATE TABLE public.new_consumers (
            id uuid NOT NULL,
            identity_id character varying(36) NOT NULL,
            unique_identifier character varying(14),
            created_at timestamp(0) without time zone DEFAULT now() NOT NULL,
            created_by character varying(100) NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'partner') THEN
        CREATE TABLE public.partner (
            name character varying(80) NOT NULL,
            categories public.partnercategory[] NOT NULL,
            status public.partnerstatus NOT NULL,
            tax_registration_number character varying(9) NOT NULL,
            commercial_registration_number character varying(80),
            id uuid NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'partner_bank_account') THEN
        CREATE TABLE public.partner_bank_account (
            partner_id uuid NOT NULL,
            bank_name public.bankname NOT NULL,
            branch_name character varying(80) NOT NULL,
            beneficiary_name character varying(80) NOT NULL,
            iban character varying(80) NOT NULL,
            swift_code character varying(80) NOT NULL,
            account_number character varying(80) NOT NULL,
            id uuid NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'partner_branch') THEN
        CREATE TABLE public.partner_branch (
            partner_id uuid NOT NULL,
            governorate public.governorate,
            city character varying(80),
            area character varying(80),
            street character varying(80) NOT NULL,
            location_latitude character varying(80) NOT NULL,
            location_longitude character varying(80) NOT NULL,
            id uuid NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            google_maps_link text DEFAULT ''::character varying,
            name character varying(255) DEFAULT 'الرئيسي'::character varying NOT NULL,
            governorate_id integer,
            city_id integer,
            area_id integer
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'partner_top') THEN
        CREATE TABLE public.partner_top (
            partner_id uuid NOT NULL,
            id uuid NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            rank integer
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'partner_user_profile') THEN
        CREATE TABLE public.partner_user_profile (
            iam_id uuid NOT NULL,
            partner_id uuid NOT NULL,
            first_name character varying(50) NOT NULL,
            last_name character varying(50) NOT NULL,
            phone_number character varying NOT NULL,
            email character varying,
            national_id character varying(14),
            profile_type public.profiletype NOT NULL,
            id uuid NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            branch_id uuid
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'registry_payment') THEN
        CREATE TABLE public.registry_payment (
            id character varying(26) NOT NULL,
            status public.paymentstatus NOT NULL,
            channel public.paymentchannel NOT NULL,
            channel_reference_id character varying(80) NOT NULL,
            channel_transaction_id character varying(80) NOT NULL,
            payee_id character varying(80) NOT NULL,
            payee_type public.payeetype NOT NULL,
            payee_id_type public.payeeidtype NOT NULL,
            billing_account character varying(80) NOT NULL,
            billing_account_schedule_id integer NOT NULL,
            amount_units integer NOT NULL,
            amount_currency public.currencycode NOT NULL,
            raw_request jsonb,
            booking_time timestamp without time zone NOT NULL,
            created_at timestamp without time zone NOT NULL,
            updated_at timestamp without time zone NOT NULL,
            created_by character varying(80) NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sanction_list') THEN
        CREATE TABLE public.sanction_list (
            id integer NOT NULL,
            original_name character varying(255) NOT NULL,
            searchable_text character varying(255) NOT NULL,
            national_id character varying(20),
            sanction_type public.sanction_type NOT NULL
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sanction_list_id_seq') THEN
        CREATE SEQUENCE public.sanction_list_id_seq
            AS integer
            START WITH 1
            INCREMENT BY 1
            NO MINVALUE
            NO MAXVALUE
            CACHE 1;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'session_baskets') THEN
        CREATE TABLE public.session_baskets (
            id uuid DEFAULT gen_random_uuid() NOT NULL,
            partner_id uuid NOT NULL,
            branch_id uuid,
            cashier_id uuid NOT NULL,
            consumer_id uuid,
            partner_name character varying NOT NULL,
            status character varying NOT NULL,
            product jsonb NOT NULL,
            created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.car_models
(
    id integer NOT NULL,
    name_en character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name_ar character varying(255) COLLATE pg_catalog."default" NOT NULL,
    unique_identifier character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    updated_at timestamp without time zone NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.cities
(
    id integer NOT NULL,
    mc_id integer,
    name_ar character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name_en character varying(255) COLLATE pg_catalog."default" NOT NULL,
    governorate_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE TABLE IF NOT EXISTS public.areas
(
    id integer NOT NULL,
    mc_id integer,
    name_ar character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name_en character varying(255) COLLATE pg_catalog."default" NOT NULL,
    city_id integer NOT NULL,
    governorate_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
CREATE TABLE IF NOT EXISTS public.beta_consumers
(
    id integer NOT NULL,
    phone_number character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now() ,
    updated_at timestamp without time zone NOT NULL DEFAULT now() 
);
CREATE TABLE IF NOT EXISTS public.consumers_credit_limits
(
    id uuid NOT NULL,
    consumer_id uuid NOT NULL,
    value integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
	id uuid NOT NULL DEFAULT gen_random_uuid(),
	actor_id uuid NULL,
	actor_type varchar NULL,
	record_id uuid NULL,
	action_time timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	"after" jsonb NULL
);
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'car_models') THEN
ALTER SEQUENCE public.car_models_id_seq OWNED BY public.car_models.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'beta_consumers') THEN
ALTER SEQUENCE public.beta_consumers_id_seq OWNED BY public.beta_consumers.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'areas') THEN
ALTER SEQUENCE public.areas_id_seq OWNED BY public.areas.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'jobs') THEN
        ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
    END IF;
END $$;




DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sanction_list') THEN
        ALTER SEQUENCE public.sanction_list_id_seq OWNED BY public.sanction_list.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'cities') THEN
        ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'clubs') THEN
        ALTER SEQUENCE public.clubs_id_seq OWNED BY public.clubs.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'consumer_house_type') THEN
        ALTER SEQUENCE public.consumer_house_type_id_seq OWNED BY public.consumer_house_type.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consumer_marital_status' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER SEQUENCE public.consumer_marital_status_id_seq OWNED BY public.consumer_marital_status.id;
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'governorates' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER SEQUENCE public.governorates_id_seq OWNED BY public.governorates.id;
    END IF;
END $$;


DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'areas' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.areas ALTER COLUMN id SET DEFAULT nextval('public.areas_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'car_models' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.car_models ALTER COLUMN id SET DEFAULT nextval('public.car_models_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cities' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clubs' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.clubs ALTER COLUMN id SET DEFAULT nextval('public.clubs_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consumer_house_type' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.consumer_house_type ALTER COLUMN id SET DEFAULT nextval('public.consumer_house_type_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consumer_marital_status' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.consumer_marital_status ALTER COLUMN id SET DEFAULT nextval('public.consumer_marital_status_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'governorates' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.governorates ALTER COLUMN id SET DEFAULT nextval('public.governorates_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sanction_list' AND column_name = 'id' AND column_default IS NULL) THEN
        ALTER TABLE ONLY public.sanction_list ALTER COLUMN id SET DEFAULT nextval('public.sanction_list_id_seq'::regclass);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'areas_mc_id_key') THEN
        ALTER TABLE ONLY public.areas ADD CONSTRAINT areas_mc_id_key UNIQUE (mc_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'areas_pkey') THEN
        ALTER TABLE ONLY public.areas ADD CONSTRAINT areas_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'beta_consumers_pkey') THEN
        ALTER TABLE ONLY public.beta_consumers ADD CONSTRAINT beta_consumers_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'car_models_pkey') THEN
        ALTER TABLE ONLY public.car_models ADD CONSTRAINT car_models_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'car_models_unique_identifier_key') THEN
        ALTER TABLE ONLY public.car_models ADD CONSTRAINT car_models_unique_identifier_key UNIQUE (unique_identifier);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'checkout_baskets_pkey') THEN
        ALTER TABLE ONLY public.checkout_baskets ADD CONSTRAINT checkout_baskets_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'checkout_baskets_transaction_id_key') THEN
        ALTER TABLE ONLY public.checkout_baskets ADD CONSTRAINT checkout_baskets_transaction_id_key UNIQUE (transaction_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cities_mc_id_key') THEN
        ALTER TABLE ONLY public.cities ADD CONSTRAINT cities_mc_id_key UNIQUE (mc_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cities_pkey') THEN
        ALTER TABLE ONLY public.cities ADD CONSTRAINT cities_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'clubs_pkey') THEN
        ALTER TABLE ONLY public.clubs ADD CONSTRAINT clubs_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_address_pkey') THEN
        ALTER TABLE ONLY public.consumer_address ADD CONSTRAINT consumer_address_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_application_pkey') THEN
        ALTER TABLE ONLY public.consumer_application ADD CONSTRAINT consumer_application_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_application_state_pkey') THEN
        ALTER TABLE ONLY public.consumer_application_state ADD CONSTRAINT consumer_application_state_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_credit_limits_pkey') THEN
        ALTER TABLE ONLY public.consumer_credit_limits ADD CONSTRAINT consumer_credit_limits_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_kyc_pkey') THEN
        ALTER TABLE ONLY public.consumer_kyc ADD CONSTRAINT consumer_kyc_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_marital_status_pkey') THEN
        ALTER TABLE ONLY public.consumer_marital_status ADD CONSTRAINT consumer_marital_status_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_phone_pkey') THEN
        ALTER TABLE ONLY public.consumer_phone ADD CONSTRAINT consumer_phone_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_state_pkey') THEN
        ALTER TABLE ONLY public.consumer_state ADD CONSTRAINT consumer_state_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_used_credit_limits_pkey') THEN
        ALTER TABLE ONLY public.consumer_used_credit_limits ADD CONSTRAINT consumer_used_credit_limits_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_user_details_consumer_id_key') THEN
        ALTER TABLE ONLY public.consumer_user_details ADD CONSTRAINT consumer_user_details_consumer_id_key UNIQUE (consumer_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_user_details_pkey') THEN
        ALTER TABLE ONLY public.consumer_user_details ADD CONSTRAINT consumer_user_details_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumers_credit_limits_pkey') THEN
        ALTER TABLE ONLY public.consumers_credit_limits ADD CONSTRAINT consumers_credit_limits_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumers_pkey') THEN
        ALTER TABLE ONLY public.consumers ADD CONSTRAINT consumers_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'governorates_mc_id_key') THEN
        ALTER TABLE ONLY public.governorates ADD CONSTRAINT governorates_mc_id_key UNIQUE (mc_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'governorates_pkey') THEN
        ALTER TABLE ONLY public.governorates ADD CONSTRAINT governorates_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'jobs_pkey') THEN
        ALTER TABLE ONLY public.jobs ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'jobs_unique_identifier_key') THEN
        ALTER TABLE ONLY public.jobs ADD CONSTRAINT jobs_unique_identifier_key UNIQUE (unique_identifier);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'new_consumers_identity_id_key') THEN
        ALTER TABLE ONLY public.new_consumers ADD CONSTRAINT new_consumers_identity_id_key UNIQUE (identity_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'new_consumers_pkey') THEN
        ALTER TABLE ONLY public.new_consumers ADD CONSTRAINT new_consumers_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'new_consumers_unique_identifier_key') THEN
        ALTER TABLE ONLY public.new_consumers ADD CONSTRAINT new_consumers_unique_identifier_key UNIQUE (unique_identifier);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_bank_account_pkey') THEN
        ALTER TABLE ONLY public.partner_bank_account ADD CONSTRAINT partner_bank_account_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_branch_pkey') THEN
        ALTER TABLE ONLY public.partner_branch ADD CONSTRAINT partner_branch_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_name_key') THEN
        ALTER TABLE ONLY public.partner ADD CONSTRAINT partner_name_key UNIQUE (name);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_pkey') THEN
        ALTER TABLE ONLY public.partner ADD CONSTRAINT partner_pkey PRIMARY KEY (id);
    END IF;
END $$;


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_tax_registration_number_key') THEN
        ALTER TABLE ONLY public.partner ADD CONSTRAINT partner_tax_registration_number_key UNIQUE (tax_registration_number);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_top_pkey') THEN
        ALTER TABLE ONLY public.partner_top ADD CONSTRAINT partner_top_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_user_profile_pkey') THEN
        ALTER TABLE ONLY public.partner_user_profile ADD CONSTRAINT partner_user_profile_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'registry_payment_pkey') THEN
        ALTER TABLE ONLY public.registry_payment ADD CONSTRAINT registry_payment_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'sanction_list_pkey') THEN
        ALTER TABLE ONLY public.sanction_list ADD CONSTRAINT sanction_list_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'session_baskets_pkey') THEN
        ALTER TABLE ONLY public.session_baskets ADD CONSTRAINT session_baskets_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'unique_national_id') THEN
        ALTER TABLE ONLY public.sanction_list ADD CONSTRAINT unique_national_id UNIQUE (national_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'unique_searchable_text_with_sanction_type') THEN
        ALTER TABLE ONLY public.sanction_list ADD CONSTRAINT unique_searchable_text_with_sanction_type UNIQUE (searchable_text, sanction_type);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_consumers_iam_id') THEN
        CREATE INDEX ix_consumers_iam_id ON public.consumers USING btree (iam_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_consumers_identity_id') THEN
        CREATE UNIQUE INDEX ix_consumers_identity_id ON public.new_consumers USING btree (identity_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_consumers_phone_number') THEN
        CREATE UNIQUE INDEX ix_consumers_phone_number ON public.consumers USING btree (phone_number);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'ix_consumers_unique_identifier') THEN
        CREATE UNIQUE INDEX ix_consumers_unique_identifier ON public.new_consumers USING btree (unique_identifier);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'searchable_text_btree_idx') THEN
        CREATE INDEX searchable_text_btree_idx ON public.sanction_list USING btree (searchable_text);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'areas_city_id_fkey') THEN
        ALTER TABLE ONLY public.areas ADD CONSTRAINT areas_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'areas_governorate_id_fkey') THEN
        ALTER TABLE ONLY public.areas ADD CONSTRAINT areas_governorate_id_fkey FOREIGN KEY (governorate_id) REFERENCES public.governorates(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'cities_governorate_id_fkey') THEN
        ALTER TABLE ONLY public.cities ADD CONSTRAINT cities_governorate_id_fkey FOREIGN KEY (governorate_id) REFERENCES public.governorates(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_address_area_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_address ADD CONSTRAINT consumer_address_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_address_city_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_address ADD CONSTRAINT consumer_address_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_address_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_address ADD CONSTRAINT consumer_address_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_address_governorate_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_address ADD CONSTRAINT consumer_address_governorate_id_fkey FOREIGN KEY (governorate_id) REFERENCES public.governorates(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_application_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_application ADD CONSTRAINT consumer_application_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_application_state_consumer_application_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_application_state ADD CONSTRAINT consumer_application_state_consumer_application_id_fkey FOREIGN KEY (consumer_application_id) REFERENCES public.consumer_application(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_kyc_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_kyc ADD CONSTRAINT consumer_kyc_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_phone_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_phone ADD CONSTRAINT consumer_phone_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_state_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_state ADD CONSTRAINT consumer_state_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumer_user_details_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumer_user_details ADD CONSTRAINT consumer_user_details_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.new_consumers(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'consumers_credit_limits_consumer_id_fkey') THEN
        ALTER TABLE ONLY public.consumers_credit_limits ADD CONSTRAINT consumers_credit_limits_consumer_id_fkey FOREIGN KEY (consumer_id) REFERENCES public.consumers(id);
    END IF;
END $$;


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_bank_account_partner_id_fkey') THEN
        ALTER TABLE ONLY public.partner_bank_account ADD CONSTRAINT partner_bank_account_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_branch_area_id_fkey') THEN
        ALTER TABLE ONLY public.partner_branch ADD CONSTRAINT partner_branch_area_id_fkey FOREIGN KEY (area_id) REFERENCES public.areas(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_branch_city_id_fkey') THEN
        ALTER TABLE ONLY public.partner_branch ADD CONSTRAINT partner_branch_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_branch_governorate_id_fkey') THEN
        ALTER TABLE ONLY public.partner_branch ADD CONSTRAINT partner_branch_governorate_id_fkey FOREIGN KEY (governorate_id) REFERENCES public.governorates(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_branch_partner_id_fkey') THEN
        ALTER TABLE ONLY public.partner_branch ADD CONSTRAINT partner_branch_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_top_partner_id_fkey') THEN
        ALTER TABLE ONLY public.partner_top ADD CONSTRAINT partner_top_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_user_profile_branch_id_fkey') THEN
        ALTER TABLE ONLY public.partner_user_profile ADD CONSTRAINT partner_user_profile_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.partner_branch(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'partner_user_profile_partner_id_fkey') THEN
        ALTER TABLE ONLY public.partner_user_profile ADD CONSTRAINT partner_user_profile_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.partner(id);
    END IF;
END $$;
