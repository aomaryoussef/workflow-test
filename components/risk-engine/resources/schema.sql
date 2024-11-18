-- Models table
CREATE TABLE _services.models (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    version INT NOT NULL,
    features_names JSON,
    features_dtypes JSON,
    parameters JSON,
    is_active boolean DEFAULT false NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name, version)
);

-- Requests table
CREATE TABLE _services.requests (
    id UUID PRIMARY KEY,
    consumer_id UUID NOT NULL,
    scenario VARCHAR(50) NOT NULL,
    input_data JSON NOT NULL,
    trace_id VARCHAR(50) NOT NULL,
    booking_time TIMESTAMP NOT NULL, -- should be this format 2024-07-26T11:10:34
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_requests_consumer_id ON _services.requests (consumer_id);
CREATE INDEX idx_requests_trace_id ON _services.requests (trace_id);

-- Runs table
CREATE TABLE _services.runs (
    id UUID PRIMARY KEY,
    request_id UUID REFERENCES _services.requests(id),
    model_id UUID REFERENCES _services.models(id),
    input_data JSON NOT NULL,
    output_data JSON NOT NULL,
    execution_duration_ms INTEGER NOT NULL,
    trace_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    booking_time TIMESTAMP, -- should be this format 2024-07-26T11:10:34
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_runs_request_id ON _services.runs (request_id);
CREATE INDEX idx_runs_trace_id ON _services.runs (trace_id);

-- Scoring Output table
CREATE TABLE _services.scoring_output (
    id UUID PRIMARY KEY,
    consumer_ssn VARCHAR(14) NOT NULL,
    consumer_id UUID NOT NULL,
    runs_id UUID REFERENCES _services.runs(id),
    request_id UUID REFERENCES _services.requests(id),
    ar_status VARCHAR(20),
    calc_credit_limit INT,
    pd_predictions FLOAT,
    income_predictions INT,
    income_zone VARCHAR(50),
    final_net_income INT,
    cwf_segment VARCHAR(20),
    cwf FLOAT,
    trace_id VARCHAR(50) NOT NULL,
    booking_time TIMESTAMP, -- should be this format 2024-07-26T11:10:34
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_scoring_output_request_id ON _services.scoring_output (request_id);
CREATE INDEX idx_scoring_output_consumer_id ON _services.scoring_output (consumer_id);
CREATE INDEX idx_scoring_output_trace_id ON _services.scoring_output (trace_id);
CREATE INDEX idx_scoring_output_runs_id ON _services.scoring_output (runs_id);

-- iScore table
CREATE TABLE _services.iscore (
    id UUID PRIMARY KEY,
    consumer_id UUID NOT NULL,
    consumer_ssn VARCHAR(14) NOT NULL,
    iscore_id UUID,
    request_id UUID REFERENCES _services.requests(id),
    iscore_score INT,
    iscore_report JSON,
    status VARCHAR(10) NOT NULL,
    trace_id VARCHAR(50) NOT NULL,
    booking_time TIMESTAMP, -- should be this format 2024-07-26T11:10:34
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_iscore_consumer_id ON _services.iscore (consumer_id);
CREATE INDEX idx_iscore_consumer_ssn ON _services.iscore (consumer_ssn);
CREATE INDEX idx_iscore_request_id ON _services.iscore (request_id);
CREATE INDEX idx_iscore_trace_id ON _services.iscore (trace_id);


-- iScore Raw table for audit purpose
CREATE TABLE _services.iscore_raw_response (
    id UUID PRIMARY KEY,
    iscore_id UUID REFERENCES _services.iscore(id),
    request_id UUID REFERENCES _services.requests(id),
    raw_response TEXT,
    trace_id VARCHAR(50) NOT NULL,
    booking_time TIMESTAMP, -- should be this format 2024-07-26T11:10:34
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_iscore_raw_response_request_id ON _services.iscore_raw_response (request_id);
CREATE INDEX idx_iscore_raw_response_trace_id ON _services.iscore_raw_response (trace_id);


-- lookups table
CREATE TABLE _services.lookups (
    id UUID PRIMARY KEY,
    lookup_type VARCHAR(50) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT unique_lookup_type_slug UNIQUE (lookup_type, slug)
);
CREATE INDEX idx_slug ON _services.lookups(slug);

------------ TO NOT BE USED ------------

---- Credit Utilization table
--CREATE TABLE credit_utilization (
--    id UUID PRIMARY KEY,
--    consumer_id UUID NOT NULL,
--    active_since TIMESTAMP, -- should be this format 2024-07-26T11:10:34
--    available_credit_limit INT,
--    max_credit_limit INT,
--    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--);
--CREATE INDEX idx_credit_utilization_consumer_id ON credit_utilization (consumer_id);
--
---- PD Model Output table
--CREATE TABLE pd_model_output (
--    id UUID PRIMARY KEY,
--    consumer_id UUID NOT NULL,
--    consumer_ssn VARCHAR(14),
--    input_data JSON,
--    pd_predictions FLOAT,
--    trace_id VARCHAR(50) NOT NULL,
--    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--);
--CREATE INDEX idx_pd_model_output_consumer_id ON pd_model_output (consumer_id);
--CREATE INDEX idx_pd_model_output_consumer_ssn ON pd_model_output (consumer_ssn);
--CREATE INDEX idx_pd_model_output_trace_id ON pd_model_output (trace_id);
--
---- Income Model Output table
--CREATE TABLE income_model_output (
--    id UUID PRIMARY KEY,
--    consumer_id UUID NOT NULL,
--    consumer_ssn VARCHAR(14),
--    input_data JSON,
--    income_predictions INT,
--    trace_id VARCHAR(50) NOT NULL,
--    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--);
--CREATE INDEX idx_income_model_output_consumer_id ON income_model_output (consumer_id);
--CREATE INDEX idx_income_model_output_consumer_ssn ON income_model_output (consumer_ssn);
--CREATE INDEX idx_income_model_output_trace_id ON income_model_output (trace_id);
--
---- Calculation Center Model Output table
--CREATE TABLE calculation_center_model_output (
--    id UUID PRIMARY KEY,
--    consumer_id UUID NOT NULL,
--    consumer_ssn VARCHAR(14),
--    input_data JSON,
--    ar_status VARCHAR(20),
--    calc_credit_limit INT,
--    pd_predictions FLOAT,
--    income_predictions INT,
--    income_zone VARCHAR(50),
--    final_net_income INT,
--    cwf_segment VARCHAR(20),
--    cwf FLOAT,
--    trace_id VARCHAR(50) NOT NULL,
--    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
--);
--CREATE INDEX idx_calculation_center_model_output_consumer_id ON calculation_center_model_output (consumer_id);
--CREATE INDEX idx_calculation_center_model_output_consumer_ssn ON calculation_center_model_output (consumer_ssn);
--CREATE INDEX idx_calculation_center_model_output_trace_id ON calculation_center_model_output (trace_id);

-- Model Data Sample
insert into _services.models (id, name, type, version, features_names, features_dtypes, parameters, is_active, created_at)
values  ('e3922926-22ce-44bd-8d01-68d8998527c2', 'FeatureStoreModel', 'PRE_PROCESSING', 1, null, null, null, true, '2024-08-06 15:29:54.767410'),
        ('8a0371f3-ded8-4a00-980a-66cc6709ca30', 'CalculationCenterModel', 'CALCULATIONS', 1, null, null, '{"GREEN_INCOME_ZONE_THRESHOLD":0.1,"RED_INCOME_ZONE_THRESHOLD":0.5,"FIN_TO_PRED_INCOME_CAP":4,"PD_AR_THRESHOLD":0.145,"PD_BINS_TO_CWF":{"pd_in":[0.145, 0.09, 0.045, 0.025, 0.01, 0],"cwf_map":[2, 2.5, 3.5, 6, 8],"risk_seg_map":["Tier-5","Tier-4","Tier-3","Tier-2","Tier-1"]}, "CL_MAX_LIMIT" : 500000, "CL_MIN_LIMIT" : 1000, "LEGACY_CWF": 4, "LEGACY_PD_CWF_SLOPE":0.007}', true, '2024-08-06 15:29:54.767410'),
        ('71973c7c-6a91-44b1-ae1a-87aab4410440', 'PDModel', 'ML', 7, null, null, '{"GREEN_INCOME_ZONE_THRESHOLD":0.1,"RED_INCOME_ZONE_THRESHOLD":0.5,"FIN_TO_PRED_INCOME_CAP":4}', true, '2024-08-06 15:29:54.767410'),
        ('fe96a1ce-7ba1-4903-b5fb-a5e72040aff8', 'IncomeModel', 'ML', 7, null, null, null, true, '2024-08-06 15:29:54.767410');

-- Lookups Data Sample
insert into _services.lookups (id, lookup_type, slug, name, description)
values  ('f1aa23d2-7bf5-491d-a1fd-38767b9a830d', 'mobile_os_type', 'android', 'Android', null),
        ('8e9f5e92-ad18-41f2-a55a-74b2865b9de6', 'mobile_os_type', 'ios', 'iOS', null),
        ('56c80749-7273-4213-bf8c-c66708d64808', 'mobile_os_type', 'other', 'Other', null),
        ('b607f6d3-541f-4fee-a487-01f82debf27d', 'house_type', 'other', 'Other', null),
        ('e16a102e-f074-44d2-b8c2-0ae1b9d0116d', 'marital_status', 'single', 'Single', null),
        ('4d466690-9a1b-46a1-ad42-96db4da4ff58', 'marital_status', 'married', 'Married', null),
        ('7b22506c-b358-4634-bc4f-cff89c3f0984', 'marital_status', 'divorced', 'Divorced', null),
        ('c10bd570-6412-43f4-8d50-d7146b0694d9', 'marital_status', 'widowed', 'Widowed', null),
        ('5bca7351-3259-44d8-a0eb-02079b8ad32f', 'marital_status', 'separated', 'Separated', null),
        ('200d5153-9c03-402a-9097-6d0c53d0a494', 'scenario', 'SCORING', 'Scoring', null),
        ('188618cf-5255-497e-aa0d-cdc2a8c01958', 'scenario', 'VERIFIED_SCORE', 'VerifiedScore', null),
        ('288618cf-5255-497e-aa0d-cdc2a8c01959', 'scenario', 'VERIFIED_SCORE_INCOME', 'VerifiedScoreIncome', null),
        ('84f8e39e-6e08-48ef-a257-528609ec2a22', 'house_type', 'new-rent', 'New Rent', 'The property is usually rented for 1 to 5 years, making it a less secure housing option.'),
        ('b867202f-102f-4cee-9eef-68c757e964c7', 'house_type', 'owned', 'Owned', 'The property is fully owned, making it a very secure housing option.'),
        ('815370f1-5811-4ae0-8a11-8add68f7a876', 'house_type', 'old-rent', 'Old Rent', 'The property is rented for 59 years with a fixed annual rent increase, offering a secure housing option.'),
        ('581e4cb9-14e8-4138-9959-9004680b7186', 'job_name_map', 'other-freelancer', 'Other, freelancer', null),
        ('87b47934-6226-49b9-a7d8-1314e5055c7e', 'job_name_map', 'construction-trades', 'Construction & trades', null),
        ('c64f1190-1f59-44a1-824e-46c5fa7f42cc', 'job_name_map', 'healthcare', 'Healthcare', null),
        ('87c3eb26-0b93-44d2-ba98-31b9a26cc2bd', 'job_name_map', 'teaching', 'Teaching', null),
        ('2a89883e-a850-482a-80e0-92b08f60f8a8', 'job_name_map', 'legal', 'Legal', null),
        ('1b0e621d-f3de-4df8-a92e-2fae09a64b21', 'job_name_map', 'engineer', 'Engineer', null),
        ('a1256ca7-0d64-46e1-9cd5-9d0b509c29f8', 'job_name_map', 'police-officer', 'Police officer', null),
        ('958864c1-fabd-4fa3-8ca8-dd7c602984d1', 'job_name_map', 'military', 'Military', null),
        ('e530398a-6c25-4fa4-9923-39995d37e022', 'job_name_map', 'finance', 'Finance', null),
        ('4db9ce6b-d134-424e-8575-45e01f0ac51c', 'job_name_map', 'student', 'Student', null),
        ('62ff0a2f-f45d-4683-9e51-fe87b4897ff3', 'job_name_map', 'retired', 'Retired', null),
        ('6460c00a-e472-48ca-b980-e60d11b34041', 'job_name_map', 'business-owner', 'Business owner', null),
        ('595d34a4-66e2-480f-8dca-fcdab6108133', 'job_name_map', 'governmental-employee', 'Governmental Employee', null),
        ('e93331f9-d67b-4a8c-a0bd-ed8ad9f7afb7', 'job_name_map', 'unemployed', 'Unemployed', null),
        ('c00a8d22-6464-44c3-a0fd-84576e9ae1a2', 'job_name_map', 'other-employed', 'Other, employed', null),
        ('5bd02f25-9df8-4fd7-8d9e-96391917e148', 'job_name_map', 'manager', 'Manager', null),
        ('b09e0349-f122-4bea-bd83-6405a8372255', 'job_name_map', 'sales', 'Sales', null);
