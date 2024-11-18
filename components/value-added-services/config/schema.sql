create table if not exists public.new_consumers
(
    id                      uuid        not null
        primary key,
    identity_id             varchar(36) not null unique,
    unique_identifier       varchar(14) unique,
    created_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by              varchar(100) not null
);

create unique index if not exists ix_consumers_identity_id
    on public.new_consumers (identity_id);

create unique index if not exists ix_consumers_unique_identifier
    on public.new_consumers (unique_identifier);

create table if not exists public.consumer_user_details
(
    id            uuid        not null
        primary key,
    consumer_id uuid references public.new_consumers unique,
    first_name    varchar(50) not null,
    email         varchar(50),
    middle_name   varchar(50),
    last_name     varchar(50),
    national_id   varchar(20),
    date_of_birth date,
    city_of_birth varchar(50),
    nationality   varchar(50),
    created_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by    varchar(100) not null,
    updated_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    updated_by    varchar(100)
);

create table if not exists public.consumer_application
(
    id         uuid        not null
        primary key,
    consumer_id uuid references public.new_consumers,
    phone_number_e164 varchar(50) not null,
    data       json,
    created_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by    varchar(100) not null,
    updated_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    updated_by    varchar(100)
);


create table if not exists public.consumer_application_state
(
    id                      uuid        not null
        primary key,
    consumer_application_id uuid
        references public.consumer_application,
    state                   varchar(50),
    active_since            TIMESTAMP(0) WITH TIME ZONE not null,
    created_at              TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by              varchar(100) not null
);

create table if not exists public.consumer_state
(
    id           uuid        not null
        primary key,
    consumer_id  uuid        references public.new_consumers,
    state        varchar(50) not null,
    active_since TIMESTAMP(0) WITH TIME ZONE not null,
    created_at   TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by   varchar(100) not null
);


create table if not exists public.consumer_kyc
(
    id                 uuid        not null
        primary key,
    consumer_id        uuid        not null
        references public.new_consumers,
    national_id        varchar(20),
    job_title          varchar(100),
    work_type          varchar(100),
    company_name varchar(100),
    other_company_name varchar(100),
    job_level          varchar(50),
    education_level    varchar(50),
    primary_income     integer,
    additional_income  integer,
    car_year           integer,
    car_model          varchar(50),
    marital_status     varchar(50),
    house_level        varchar(50),
    club               varchar(50),
    dependants         integer DEFAULT 0,
    active_since       TIMESTAMP(0) WITH TIME ZONE not null,
    created_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by         varchar(100) not null,
    updated_at    TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    updated_by    varchar(100)
);


create table if not exists public.consumer_address
(
    id             uuid        not null
        primary key,
    consumer_id           uuid
            references public.new_consumers,
    description    varchar(255),
    is_primary     boolean     not null,
    is_active      boolean     not null,
    governorate_id INT REFERENCES public.governorates(id),
    city_id INT REFERENCES public.cities(id),
    area_id INT REFERENCES public.areas(id),
    address_line_1 varchar(100),
    address_line_2 varchar(100),
    address_line_3 varchar(100),
    postcode       varchar(50),
    latitude       float,
    longitude      float,
    created_at     TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by     varchar(100) not null
);

create table if not exists public.consumer_phone
(
    id                uuid        not null
        primary key,
    consumer_id           uuid
        references public.new_consumers,
    phone_number_e164 varchar(50) not null,
    is_primary        boolean     not null,
    is_active         boolean     not null,
    created_at        TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    created_by        varchar(100) not null
);


create table if not exists public.consumer_credit_limits
(
    id          uuid                        default uuid_generate_v4() not null
            primary key,
    consumer_id            uuid      not null,
    max_credit_limit       integer   not null,
    available_credit_limit integer   not null,
    active_since       TIMESTAMP(0) WITH TIME ZONE not null,
    created_at     TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
    updated_at   TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
);

create table if not exists public.consumer_used_credit_limits
(
    id          uuid                        default uuid_generate_v4() not null
            primary key,
    consumer_id uuid                                                   not null,
    used_credit integer                                                not null,
    created_at     TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC') not null,
);

CREATE TABLE public.clubs (
	id serial4 NOT NULL,
	name_en varchar(255) NOT NULL,
	name_ar varchar(255) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT clubs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.car_models (
	id serial4 NOT NULL,
	name_en varchar(255) NOT NULL,
	name_ar varchar(255) NOT NULL,
	unique_identifier varchar(255) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT car_models_pkey PRIMARY KEY (id),
	CONSTRAINT car_models_unique_identifier_key UNIQUE (unique_identifier)
);

CREATE TABLE public.jobs (
	id serial4 NOT NULL,
	name_en varchar(255) NOT NULL,
	name_ar varchar(255) NOT NULL,
	unique_identifier varchar(255) NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT jobs_pkey PRIMARY KEY (id),
	CONSTRAINT jobs_unique_identifier_key UNIQUE (unique_identifier)
);


CREATE TABLE IF NOT EXISTS public.beta_consumers
(
    id SERIAL NOT NULL DEFAULT ,
    phone_number character varying(255) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT beta_consumers_pkey PRIMARY KEY (id)
)

create type  public.sanction_type AS ENUM (
    'SANCTION_LIST',
    'TERRORIST_LIST'
);

create table if not exists public.sanction_list (
    id SERIAL PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    searchable_text VARCHAR(255) NOT NULL,
    national_id VARCHAR(20),
    sanction_type sanction_type NOT NULL
);

ALTER TABLE public.sanction_list
ADD CONSTRAINT unique_national_id UNIQUE (national_id);

ALTER TABLE public.sanction_list 
ADD CONSTRAINT unique_searchable_text_with_sanction_type UNIQUE (searchable_text,sanction_type);

CREATE INDEX searchable_text_btree_idx
ON public.sanction_list (searchable_text);


INSERT INTO public.jobs (id, name_en, name_ar, unique_identifier, created_at, updated_at) VALUES
(1, 'Business Owner', 'مالك اعمال', 'business-owner', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(2, 'Construction Trades', 'تجارة البناء', 'construction-trades', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(3, 'Engineer', 'مهندس', 'engineer', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(4, 'Finance', 'المالية', 'finance', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(5, 'Governmental Employee', 'موظف حكومي', 'governmental-employee', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(6, 'Healthcare', 'الرعاية الصحية', 'healthcare', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(7, 'Legal', 'قانوني', 'legal', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(8, 'Manager', 'مدير', 'manager', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(9, 'Military', 'الجيش', 'military', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(10, 'Police Officer', 'ضابط شرطة', 'police-officer', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(12, 'Sales', 'مبيعات', 'sales', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(14, 'Teaching', 'مدرس', 'teaching', '2024-10-02 22:07:06.379007', '2024-10-02 22:07:06.379007'),
(16, 'Other', 'أخري', 'other-employed', '2024-10-16 15:30:40.912833', '2024-10-16 15:30:40.912833');


INSERT INTO public.clubs (id, name_en, name_ar, created_at, updated_at) VALUES
(1, 'Hurghada Sporting Club', 'نادي الغردقة الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(2, 'Senzo Sporting Club', 'نادي سنزو الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(3, 'Port Said Sporting Club', 'نادي بورسعيد الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(4, 'Al Masry Sporting Club', 'النادي المصري الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(5, 'Al Gomhouria Sporting Club', 'نادي الجمهورية الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(6, 'Al Mansoura Sporting Club', 'نادي المنصورة الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(7, 'Geziret ElWard Sporting Club', 'نادي جزيرة الورد الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(8, 'Ismaily Sporting Club', 'نادي الإسماعيلي الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(9, 'Smash', 'سماش', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(10, 'KODE Sports Club', 'نادي كود الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(11, 'Cairo Sporting', 'نادي القاهرة الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(12, '6th of October', 'نادي 6 أكتوبر', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(13, 'Matrix Sports Club', 'نادي ماتريكس الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(14, 'Tanta Sporting Club', 'نادي طنطا الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(15, 'Sporting Castle Club', 'نادي القلعة الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(16, 'Al Abd Sporting Club', 'نادي العبد الرياضي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(17, 'Maadi and Yacht', 'نادي المعادي واليخت', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(18, 'AL Ahly', 'النادي الأهلي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(19, 'Allegria Club', 'نادي أليجريا', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(20, 'Arabella Fifth Settlement Club', 'نادي أرابيلا التجمع الخامس', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(21, 'Gezeriah Club', 'نادي الجزيرة', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(22, 'Heliopolis Club', 'نادي هليوبوليس', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(23, 'Katameya Golf Club', 'نادي القطامية للجولف', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(24, 'Madinty Club', 'نادي مدينتي', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(25, 'New Giza Club', 'نادي نيو جيزة', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863'),
(26, 'Palm Hills Club', 'نادي بالم هيلز', '2024-10-08 12:46:47.528863', '2024-10-08 12:46:47.528863');


INSERT INTO public.car_models (id, name_en, name_ar, unique_identifier, created_at, updated_at) VALUES
(1, 'BMW', 'بي إم دبليو', 'bmw', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(2, 'Kia', 'كيا', 'kia', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(3, 'Hyundai', 'هيونداي', 'hyundai', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(4, 'Audi', 'أودي', 'audi', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(5, 'Toyota', 'تويوتا', 'toyota', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(6, 'Chevrolet', 'شيفروليه', 'chevrolet', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(7, 'BYD', 'بي واي دي', 'byd', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(8, 'Fiat', 'فيات', 'fiat', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(9, 'Honda', 'هوندا', 'honda', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(10, 'Jeep', 'جيب', 'jeep', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(11, 'Nissan', 'نيسان', 'nissan', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(12, 'Mercedes-Benz', 'مرسيدس بنز', 'mercedes-benz', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541'),
(13, 'Other', 'أخرى', 'other', '2024-10-02 22:07:11.455541', '2024-10-02 22:07:11.455541');


INSERT INTO public.beta_consumers (id, phone_number, created_at, updated_at) VALUES
(1, '+201070091007', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(2, '+201227184561', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(3, '+201003138613', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(4, '+201030880008', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(5, '+201006847808', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(6, '+201226191931', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(7, '+201552168223', '2024-10-20 15:30:00', '2024-10-20 15:30:00'),
(8, '+201151812346', '2024-10-20 15:30:00', '2024-10-20 15:30:00');

-- 1. Insert into new_consumers (only new consumers)
INSERT INTO public.new_consumers (id, identity_id, unique_identifier, created_at, created_by)
SELECT 
    c.id, 
    c.iam_id, 
    c.national_id, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.new_consumers nc ON c.id = nc.id
WHERE nc.id IS NULL;

-- 2. Insert into consumer_user_details (only new entries)
INSERT INTO public.consumer_user_details (
    id, 
    consumer_id, 
    first_name, 
    middle_name, 
    last_name, 
    email, 
    national_id, 
    date_of_birth, 
    city_of_birth, 
    nationality, 
    created_at, 
    created_by, 
    updated_at, 
    updated_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.first_name, 
    NULL AS middle_name,  -- no middle name
    c.last_name, 
    NULL AS email, 
    c.national_id, 
    NULL AS date_of_birth, 
    c.city, 
    'Egyptian' AS nationality, 
    c.created_at, 
    'migration_script' AS created_by, 
    c.updated_at, 
    'migration_script' AS updated_by
FROM public.consumers c
LEFT JOIN public.consumer_user_details cud ON c.id = cud.consumer_id
WHERE cud.consumer_id IS NULL;

-- 3. Insert into consumer_kyc (only new entries)
INSERT INTO public.consumer_kyc (
    id, 
    consumer_id, 
    national_id, 
    job_title, 
    work_type, 
    company_name, 
    other_company_name, 
    job_level, 
    education_level, 
    primary_income, 
    additional_income, 
    car_year, 
    car_model, 
    marital_status, 
    house_level, 
    club, 
    dependants, 
    active_since, 
    created_at, 
    created_by, 
    updated_at, 
    updated_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.national_id, 
    c.job_name, 
    c.work_type, 
    c.company, 
    NULL AS other_company_name, 
    NULL AS job_level, 
    NULL AS education_level, 
    c.salary::integer, 
    c.additional_salary::integer, 
    c.car_year, 
    NULL AS car_model, 
    c.marital_status, 
    c.house_type, 
    c.club, 
    0 AS dependants, 
    c.activated_at, 
    c.created_at, 
    'migration_script' AS created_by, 
    c.updated_at, 
    'migration_script' AS updated_by
FROM public.consumers c
LEFT JOIN public.consumer_kyc ck ON c.id = ck.consumer_id
WHERE ck.consumer_id IS NULL;

-- 4. Insert into consumer_address (only new entries)
INSERT INTO public.consumer_address (
    id, 
    consumer_id, 
    description, 
    is_primary, 
    is_active, 
    governorate_id, 
    city_id, 
    area_id, 
    address_line_1, 
    address_line_2, 
    address_line_3, 
    postcode, 
    latitude, 
    longitude, 
    created_at, 
    created_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.address_description, 
    TRUE AS is_primary, 
    TRUE AS is_active, 
    NULL AS governorate_id, 
    NULL AS city_id, 
    NULL AS area_id, 
    c.address, 
    NULL AS address_line_2, 
    NULL AS address_line_3, 
    NULL AS postcode, 
    NULL AS latitude, 
    NULL AS longitude, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.consumer_address ca ON c.id = ca.consumer_id
WHERE ca.consumer_id IS NULL;

-- 5. Insert into consumer_phone (only new entries)
INSERT INTO public.consumer_phone (
    id, 
    consumer_id, 
    phone_number_e164, 
    is_primary, 
    is_active, 
    created_at, 
    created_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.phone_number, 
    TRUE AS is_primary, 
    TRUE AS is_active, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.consumer_phone cp ON c.id = cp.consumer_id AND cp.phone_number_e164 = c.phone_number
WHERE cp.consumer_id IS NULL AND c.phone_number IS NOT NULL;

-- Optional: Insert home phone number as secondary phone (only new entries)
INSERT INTO public.consumer_phone (
    id, 
    consumer_id, 
    phone_number_e164, 
    is_primary, 
    is_active, 
    created_at, 
    created_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.home_phone_number, 
    FALSE AS is_primary, 
    TRUE AS is_active, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.consumer_phone cp ON c.id = cp.consumer_id AND cp.phone_number_e164 = c.home_phone_number
WHERE cp.consumer_id IS NULL AND c.home_phone_number IS NOT NULL;


-- 1. Insert into new_consumers (only new consumers)
INSERT INTO public.new_consumers (id, identity_id, unique_identifier, created_at, created_by)
SELECT 
    c.id, 
    c.iam_id, 
    c.national_id, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.new_consumers nc ON c.id = nc.id
WHERE nc.id IS NULL;

-- 2. Insert into consumer_application with data mapped to JSON
INSERT INTO public.consumer_application (
    id, 
    consumer_id, 
    phone_number_e164, 
    data, 
    created_at, 
    created_by, 
    updated_at, 
    updated_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.phone_number, 
    json_build_object(
        'workflow_id', 'migration_script', 
        'flow_id', 'migration_script',  
        'application_status', 
        CASE 
            WHEN c.status = 'AWAITING_ACTIVATION' THEN 'SUBMITTED'
            WHEN c.status = 'ACTIVE' THEN 'APPROVED'
            WHEN c.status = 'BLOCKED' THEN 'BLOCKED'
            ELSE 'FAILED'
        END,
        'step', 'COMPLETED',
        'consumer_kyc', json_build_object(
            'client_id', c.id,
            'ssn', c.national_id,
            'phone_number_1', c.phone_number,
            'email', NULL, 
            'flag_is_mc_customer', 0,
            'net_income', c.salary,
            'marital_status', c.marital_status,
            'address_governorate', c.governorate,
            'address_city', c.city,
            'address_area', c.district,
            'house_type', c.house_type,
            'car_model_year', c.car_year,
            'first_name', c.first_name,
            'last_name', c.last_name,
            'date_of_birth', NULL
        ),
        'consumer_status', c.status,
        'consumer_cl', json_build_object(
            'consumer_id', c.id,
            'calc_credit_limit', 0,  
            'income_predictions', 0, 
            'income_zone', 'A',      
            'final_net_income', c.salary
        )
    )::json AS data,
    c.created_at, 
    'migration_script' AS created_by, 
    c.updated_at, 
    'migration_script' AS updated_by
FROM public.consumers c
LEFT JOIN public.consumer_application ca ON c.id = ca.consumer_id
WHERE ca.consumer_id IS NULL AND c.status != 'WAITING_LIST';

-- 3. Insert into consumer_application_state
INSERT INTO public.consumer_application_state (
    id, 
    consumer_application_id, 
    state, 
    active_since, 
    created_at, 
    created_by
)
SELECT 
    gen_random_uuid(), 
    ca.id, 
    CASE 
        WHEN c.status = 'AWAITING_ACTIVATION' THEN 'SUBMITTED'
        WHEN c.status = 'ACTIVE' THEN 'APPROVED'
        WHEN c.status = 'BLOCKED' THEN 'BLOCKED'
        ELSE 'FAILED'
    END AS state,
    c.activated_at, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
JOIN public.consumer_application ca ON c.id = ca.consumer_id;
WHERE ca.consumer_id IS NULL AND c.status != 'WAITING_LIST';

-- 4. Insert into consumer_state
INSERT INTO public.consumer_state (
    id, 
    consumer_id, 
    state, 
    active_since, 
    created_at, 
    created_by
)
SELECT 
    gen_random_uuid(), 
    c.id, 
    c.status::varchar(50), 
    c.activated_at, 
    c.created_at, 
    'migration_script' AS created_by
FROM public.consumers c
LEFT JOIN public.consumer_state cs ON c.id = cs.consumer_id
WHERE cs.consumer_id IS NULL;
