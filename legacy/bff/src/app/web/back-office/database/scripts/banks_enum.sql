--Add updated values to old Enum
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'MISR';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'FAIB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'BOA';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'ARAB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'CAE';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'BBE';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'ARIB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'MIDB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'MASH';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'ENBD';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'AIB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'ABRK';

--Update data of partner_bank_account table to new values
UPDATE partner_bank_account SET bank_name = 'MISR' WHERE bank_name = 'BM';
UPDATE partner_bank_account SET bank_name = 'BOA' WHERE bank_name = 'ALEXB';
UPDATE partner_bank_account SET bank_name = 'FAIB' WHERE bank_name = 'FAISALB';
UPDATE partner_bank_account SET bank_name = 'BBE' WHERE bank_name = 'WAFAB';
UPDATE partner_bank_account SET bank_name = 'CAE' WHERE bank_name = 'CA';
UPDATE partner_bank_account SET bank_name = 'ENBD' WHERE bank_name = 'NBD';
UPDATE partner_bank_account SET bank_name = 'ARAB' WHERE bank_name = 'ARABB';
UPDATE partner_bank_account SET bank_name = 'AIB' WHERE bank_name = 'BIB';
UPDATE partner_bank_account SET bank_name = 'MASH' WHERE bank_name = 'MASHRQB';
UPDATE partner_bank_account SET bank_name = 'MIDB' WHERE bank_name = 'MID';
UPDATE partner_bank_account SET bank_name = 'ARIB' WHERE bank_name = 'ArabicBank';


--Create New Enum data type
CREATE TYPE public.bankname_new AS ENUM (
'CIB', 'NBE', 'MISR', 'BDC', 'AAIB', 'FAIB', 'BOA', 'ADIB', 'ADCB', 'ARAB', 'CAE', 'HSBC', 'QNB', 'SCB', 'EGB', 'HDB', 'UB', 'EBE', 'ABK', 'AUB', 'AGB', 'AI', 'BBE', 'ARIB', 'SC', 'EALB', 'NBK', 'ABC', 'FAB', 'MIDB', 'IDB', 'MASH', 'ENBD', 'SAIB', 'AIB', 'ABRK'
);

--Change bank_name column to point to new Enum
ALTER TABLE partner_bank_account
ALTER COLUMN bank_name TYPE public.bankname_new
USING bank_name::text::public.bankname_new;

--Drop Old Enum
DROP TYPE public.bankname;

--Rename new Enum to Old name
ALTER TYPE public.bankname_new RENAME TO bankname;
