SET check_function_bodies = false;
-- Create schema if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = '_services') THEN
        CREATE SCHEMA _services;
    END IF;
END $$;

-- Create table _services.iscore
CREATE TABLE IF NOT EXISTS _services.iscore (
    id uuid NOT NULL,
    consumer_id uuid NOT NULL,
    consumer_ssn character varying(14) NOT NULL,
    iscore_id uuid,
    request_id uuid,
    iscore_score integer,
    iscore_report json,
    status character varying(10) NOT NULL,
    trace_id character varying(50) NOT NULL,
    booking_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create table _services.iscore_raw_response
CREATE TABLE IF NOT EXISTS _services.iscore_raw_response (
    id uuid NOT NULL,
    iscore_id uuid,
    request_id uuid,
    raw_response text,
    trace_id character varying(50) NOT NULL,
    booking_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create table _services.lookups
CREATE TABLE IF NOT EXISTS _services.lookups (
    id uuid NOT NULL,
    lookup_type character varying(50) NOT NULL,
    slug character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255)
);

-- Create table _services.models
CREATE TABLE IF NOT EXISTS _services.models (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    type character varying(20) NOT NULL,
    version integer NOT NULL,
    features_names json,
    features_dtypes json,
    parameters json,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create table _services.requests
CREATE TABLE IF NOT EXISTS _services.requests (
    id uuid NOT NULL,
    consumer_id uuid NOT NULL,
    scenario character varying(20) NOT NULL,
    input_data json NOT NULL,
    trace_id character varying(50) NOT NULL,
    booking_time timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create table _services.runs
CREATE TABLE IF NOT EXISTS _services.runs (
    id uuid NOT NULL,
    request_id uuid,
    model_id uuid,
    input_data json NOT NULL,
    output_data json NOT NULL,
    execution_duration_ms integer NOT NULL,
    trace_id character varying(50) NOT NULL,
    status character varying(20) NOT NULL,
    booking_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create table _services.scoring_output
CREATE TABLE IF NOT EXISTS _services.scoring_output (
    id uuid NOT NULL,
    consumer_ssn character varying(14) NOT NULL,
    consumer_id uuid NOT NULL,
    runs_id uuid,
    request_id uuid,
    ar_status character varying(20),
    calc_credit_limit integer,
    pd_predictions double precision,
    income_predictions integer,
    income_zone character varying(50),
    final_net_income integer,
    cwf_segment character varying(20),
    cwf integer,
    trace_id character varying(50) NOT NULL,
    booking_time timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'iscore_pkey') THEN
        ALTER TABLE ONLY _services.iscore ADD CONSTRAINT iscore_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'iscore_raw_response_pkey') THEN
        ALTER TABLE ONLY _services.iscore_raw_response ADD CONSTRAINT iscore_raw_response_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'lookups_pkey') THEN
        ALTER TABLE ONLY _services.lookups ADD CONSTRAINT lookups_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'models_pkey') THEN
        ALTER TABLE ONLY _services.models ADD CONSTRAINT models_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'requests_pkey') THEN
        ALTER TABLE ONLY _services.requests ADD CONSTRAINT requests_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'runs_pkey') THEN
        ALTER TABLE ONLY _services.runs ADD CONSTRAINT runs_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'scoring_output_pkey') THEN
        ALTER TABLE ONLY _services.scoring_output ADD CONSTRAINT scoring_output_pkey PRIMARY KEY (id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'unique_lookup_type_slug') THEN
        ALTER TABLE ONLY _services.lookups ADD CONSTRAINT unique_lookup_type_slug UNIQUE (lookup_type, slug);
    END IF;
END $$;


DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_consumer_id') THEN
        CREATE INDEX idx_iscore_consumer_id ON _services.iscore USING btree (consumer_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_consumer_ssn') THEN
        CREATE INDEX idx_iscore_consumer_ssn ON _services.iscore USING btree (consumer_ssn);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_raw_response_request_id') THEN
        CREATE INDEX idx_iscore_raw_response_request_id ON _services.iscore_raw_response USING btree (request_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_raw_response_trace_id') THEN
        CREATE INDEX idx_iscore_raw_response_trace_id ON _services.iscore_raw_response USING btree (trace_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_request_id') THEN
        CREATE INDEX idx_iscore_request_id ON _services.iscore USING btree (request_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_iscore_trace_id') THEN
        CREATE INDEX idx_iscore_trace_id ON _services.iscore USING btree (trace_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_requests_consumer_id') THEN
        CREATE INDEX idx_requests_consumer_id ON _services.requests USING btree (consumer_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_requests_trace_id') THEN
        CREATE INDEX idx_requests_trace_id ON _services.requests USING btree (trace_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_runs_request_id') THEN
        CREATE INDEX idx_runs_request_id ON _services.runs USING btree (request_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_runs_trace_id') THEN
        CREATE INDEX idx_runs_trace_id ON _services.runs USING btree (trace_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scoring_output_consumer_id') THEN
        CREATE INDEX idx_scoring_output_consumer_id ON _services.scoring_output USING btree (consumer_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scoring_output_request_id') THEN
        CREATE INDEX idx_scoring_output_request_id ON _services.scoring_output USING btree (request_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scoring_output_runs_id') THEN
        CREATE INDEX idx_scoring_output_runs_id ON _services.scoring_output USING btree (runs_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scoring_output_trace_id') THEN
        CREATE INDEX idx_scoring_output_trace_id ON _services.scoring_output USING btree (trace_id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_slug') THEN
        CREATE INDEX idx_slug ON _services.lookups USING btree (slug);
    END IF;
END $$;
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'iscore_raw_response_iscore_id_fkey') THEN
        ALTER TABLE ONLY _services.iscore_raw_response ADD CONSTRAINT iscore_raw_response_iscore_id_fkey FOREIGN KEY (iscore_id) REFERENCES _services.iscore(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'iscore_raw_response_request_id_fkey') THEN
        ALTER TABLE ONLY _services.iscore_raw_response ADD CONSTRAINT iscore_raw_response_request_id_fkey FOREIGN KEY (request_id) REFERENCES _services.requests(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'iscore_request_id_fkey') THEN
        ALTER TABLE ONLY _services.iscore ADD CONSTRAINT iscore_request_id_fkey FOREIGN KEY (request_id) REFERENCES _services.requests(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'runs_model_id_fkey') THEN
        ALTER TABLE ONLY _services.runs ADD CONSTRAINT runs_model_id_fkey FOREIGN KEY (model_id) REFERENCES _services.models(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'runs_request_id_fkey') THEN
        ALTER TABLE ONLY _services.runs ADD CONSTRAINT runs_request_id_fkey FOREIGN KEY (request_id) REFERENCES _services.requests(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'scoring_output_request_id_fkey') THEN
        ALTER TABLE ONLY _services.scoring_output ADD CONSTRAINT scoring_output_request_id_fkey FOREIGN KEY (request_id) REFERENCES _services.requests(id);
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'scoring_output_runs_id_fkey') THEN
        ALTER TABLE ONLY _services.scoring_output ADD CONSTRAINT scoring_output_runs_id_fkey FOREIGN KEY (runs_id) REFERENCES _services.runs(id);
    END IF;
END $$;



