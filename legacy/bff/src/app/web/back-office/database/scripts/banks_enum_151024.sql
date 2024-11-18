ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'NBG';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'NSB';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'PDAC';
ALTER TYPE public.bankname ADD VALUE IF NOT EXISTS 'POST';

UPDATE partner_bank_account SET bank_name = 'PDAC' WHERE bank_name = 'AGB';