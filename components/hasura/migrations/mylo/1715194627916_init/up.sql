SET
check_function_bodies = false;

CREATE TYPE marital_status_type AS ENUM ('married', 'single');

CREATE TYPE gender_type AS ENUM ('male', 'female');

CREATE TYPE gurantor_relation_type AS ENUM ('sister', 'brother', 'father');

CREATE TYPE collateral_type AS ENUM ('NID', 'passport');

CREATE TYPE consumer_state_type AS ENUM (
    'registered',
    'waiting_approval',
    'waiting_list',
    'active',
    'rejected'
);

CREATE TYPE guarantor_deactivation_reason_type AS ENUM ('expired');

CREATE TYPE consumer_group_member_role_type AS ENUM ('value1', 'value2');

CREATE TYPE phone_type AS ENUM ('mobile_phone', 'work_phone', 'whatsapp');

CREATE TABLE
address (
    id varchar(50) NOT NULL,
    user_id varchar(50),
    is_primary boolean NOT NULL,
    active_since_utc timestamp with time zone NOT NULL,
    active_until_utc timestamp with time zone NOT NULL,
    line_1 varchar(500) NOT NULL,
    line_2 varchar(50),
    line_3 varchar(50),
    city varchar(50) NOT NULL,
    zip varchar(50) NOT NULL,
    country varchar(50),
    state varchar(50),
    latitude varchar(50),
    longitude varchar(50),
    further_details json NULL,
    created_by varchar(50) NOT NULL,
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT pk_address PRIMARY KEY (id)
);

CREATE TABLE
collateral (
    id varchar(50) NOT NULL,
    consumer_id varchar(50) NOT NULL,
    collateral_number varchar(50) NOT NULL,
    active_since_utc timestamp with time zone DEFAULT now(),
    active_until_utc timestamp with time zone NOT NULL,
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    created_by varchar(50) NOT NULL,
    collateral_type collateral_type NOT NULL,
    collateral_physical_location varchar(50),
    collateral_digital_location varchar(50),
    updated_at_utc timestamp with time zone NOT NULL,
    updated_by varchar(50) NOT NULL,
    CONSTRAINT pk_collateral PRIMARY KEY (id)
);

CREATE TABLE
company (
    id varchar(50) NOT NULL,
    "name" varchar(50) NOT NULL,
    created_at_utc timestamp with time zone NOT NULL,
    created_by varchar(50) NOT NULL,
    is_active bool NOT NULL,
    CONSTRAINT pk_company PRIMARY KEY (id)
);

CREATE TABLE
consumer (
    id varchar(50) NOT NULL,
    identity_id varchar(50),
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    created_by varchar(50) NOT NULL,
    updated_at_utc timestamp with time zone NOT NULL,
    updated_by varchar(50) NOT NULL,
    metadata json NOT NULL,
    CONSTRAINT pk_consumers_1 PRIMARY KEY (id)
);

CREATE TABLE
consumer_application (
    id varchar(50) NOT NULL,
    created_at_utc timestamp without time zone NOT NULL DEFAULT current_timestamp,
    created_by varchar(50),
    CONSTRAINT pk_consumer_application_1 PRIMARY KEY (id)
);

CREATE TABLE
consumer_application_state (
    id varchar(50) NOT NULL,
    application_id varchar(50),
    statue varchar(50),
    active_since_utc timestamp with time zone NOT NULL,
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    created_by varchar(50),
    CONSTRAINT pk_consumer_application_state PRIMARY KEY (id)
);

CREATE TABLE
consumer_group (
    id varchar(50) NOT NULL,
    active_since_utc timestamp with time zone NOT NULL,
    active_until_utc timestamp with time zone NOT NULL,
    CONSTRAINT consumer_group_pkey PRIMARY KEY (id)
);

CREATE TABLE
consumer_group_member (
    consumer_group_id varchar(50) NOT NULL,
    consumer_id varchar(50) NOT NULL,
    "role" consumer_group_member_role_type NOT NULL,
    CONSTRAINT consumer_group_member_pkey PRIMARY KEY (
        consumer_group_id, consumer_id
    )
);

CREATE TABLE
consumer_kyc (
    id varchar(50) NOT NULL,
    consumer_id varchar(50) NOT NULL,
    job_title varchar(50),
    work_type varchar(50),
    car_type varchar(50),
    insurance_type varchar(50),
    company_id varchar(50),
    primary_income_units integer,
    additional_income_units integer,
    active_since_utc timestamp with time zone,
    active_until_utc timestamp with time zone NOT NULL,
    created_by varchar(50),
    created_at_utc timestamp with time zone DEFAULT now(),
    city_of_birth varchar(50),
    CONSTRAINT pk_consumer_kyc PRIMARY KEY (id)
);

CREATE TABLE
consumer_state (
    id varchar(50) NOT NULL,
    consumer_id varchar(50) NOT NULL,
    state consumer_state_type NOT NULL,
    active_since_utc timestamp with time zone NOT NULL,
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    created_by varchar(50) NOT NULL,
    CONSTRAINT pk_consumer_state PRIMARY KEY (id)
);

CREATE TABLE
consumer_user_mapping (
    consumer_id varchar(50) NOT NULL,
    user_id varchar(50) NOT NULL,
    CONSTRAINT consumer_user_mapping_pkey PRIMARY KEY (consumer_id, user_id)
);

CREATE TABLE
credit_limit (
    id varchar(50) NOT NULL,
    consumer_id varchar(50) NOT NULL,
    active_since_utc timestamp with time zone NOT NULL,
    total_max_limit integer NOT NULL,
    monthly_max_limit integer NOT NULL,
    created_at_utc timestamp with time zone NOT NULL DEFAULT now(),
    created_by varchar(50) NOT NULL,
    scoring_file_id varchar(50) NOT NULL,
    CONSTRAINT pk_credit_limit PRIMARY KEY (id)
);

CREATE TABLE
guarantor (
    id varchar(50) NOT NULL,
    guarantor_relation gurantor_relation_type NOT NULL,
    active_since_utc timestamp with time zone NOT NULL,
    active_until_utc timestamp with time zone NOT NULL,
    guarantor_of varchar(50) NOT NULL,
    reason_of_deactivation guarantor_deactivation_reason_type,
    CONSTRAINT guarantor_pkey PRIMARY KEY (id)
);

CREATE TABLE
guarantor_user_mapping (
    guarantor_id varchar(50) NOT NULL,
    user_id varchar(50) NOT NULL,
    CONSTRAINT guarantor_user_mapping_pkey PRIMARY KEY (guarantor_id, user_id)
);

CREATE TABLE
phone (
    id varchar(50) NOT NULL,
    user_id varchar(50),
    phone_type phone_type NOT NULL,
    phone_number_e164 varchar(50),
    is_primary boolean NOT NULL,
    is_active boolean NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at_utc timestamp without time zone NOT NULL,
    CONSTRAINT pk_phone PRIMARY KEY (id)
);

CREATE TABLE
user_detail (
    id varchar(50) NOT NULL,
    first_name varchar(50) NOT NULL,
    middle_name varchar(50),
    last_name varchar(50) NOT NULL,
    gender gender_type NOT NULL,
    marital_status marital_status_type NOT NULL,
    date_of_birth date NOT NULL,
    updated_by varchar(50) NOT NULL,
    update_at_utc timestamp with time zone NOT NULL,
    created_by varchar(50) NOT NULL,
    created_at_utc timestamp without time zone NOT NULL,
    CONSTRAINT pk_user_detail PRIMARY KEY (id)
);

ALTER TABLE consumer_user_mapping ADD CONSTRAINT consumer_user_mapping_consumer_id_fkey FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE consumer_user_mapping ADD CONSTRAINT consumer_user_mapping_user_id_fkey FOREIGN KEY (
    user_id
) REFERENCES user_detail (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE address ADD CONSTRAINT fk_address_user_detail FOREIGN KEY (
    user_id
) REFERENCES user_detail (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE collateral ADD CONSTRAINT fk_collateral_consumer FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE consumer_application_state ADD CONSTRAINT fk_consumer_application_state_consumer_application1 FOREIGN KEY (
    application_id
) REFERENCES consumer_application (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE consumer_kyc ADD CONSTRAINT fk_consumer_kyc_company FOREIGN KEY (
    company_id
) REFERENCES company (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE consumer_kyc ADD CONSTRAINT fk_consumer_kyc_consumer FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE consumer_state ADD CONSTRAINT fk_consumer_state_consumers1 FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE phone ADD CONSTRAINT fk_phone_user_detail FOREIGN KEY (
    user_id
) REFERENCES user_detail (id) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE credit_limit ADD CONSTRAINT credit_limit_consumer_id_fkey FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id);

ALTER TABLE guarantor_user_mapping ADD CONSTRAINT guarantor_user_mapping_guarantor_id_fkey FOREIGN KEY (
    guarantor_id
) REFERENCES guarantor (id);

ALTER TABLE guarantor ADD CONSTRAINT guarantor_guarantor_of_fkey FOREIGN KEY (
    guarantor_of
) REFERENCES consumer (id);

ALTER TABLE guarantor_user_mapping ADD CONSTRAINT guarantor_user_mapping_user_id_fkey FOREIGN KEY (
    user_id
) REFERENCES user_detail (id);

ALTER TABLE consumer_group_member ADD CONSTRAINT consumer_group_member_consumer_group_id_fkey FOREIGN KEY (
    consumer_group_id
) REFERENCES consumer_group (id);

ALTER TABLE consumer_group_member ADD CONSTRAINT consumer_group_member_consumer_id_fkey FOREIGN KEY (
    consumer_id
) REFERENCES consumer (id);
