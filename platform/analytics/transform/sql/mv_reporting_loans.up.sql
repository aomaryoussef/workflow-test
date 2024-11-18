DROP MATERIALIZED VIEW IF EXISTS mv_reporting_loans;

CREATE MATERIALIZED VIEW mv_reporting_loans AS
WITH dob_cte AS (
  SELECT
    c.id AS consumer_id,
    CASE 
      WHEN c.national_id IS NULL THEN NULL
      ELSE
        TO_DATE(
          (1700 + (100 * CAST(SUBSTRING(c.national_id FROM 1 FOR 1) AS INTEGER)) + CAST(SUBSTRING(c.national_id FROM 2 FOR 2) AS INTEGER))::text ||
          '-' ||
          LPAD(CAST(SUBSTRING(c.national_id FROM 4 FOR 2) AS text), 2, '0') ||
          '-' ||
          LPAD(CAST(SUBSTRING(c.national_id FROM 6 FOR 2) AS text), 2, '0'),
          'YYYY-MM-DD'
        )
    END AS consumer_dob,
    CASE
      WHEN c.national_id IS NULL THEN NULL
      ELSE
        CASE 
          WHEN CAST(SUBSTRING(c.national_id FROM 13 FOR 1) AS INTEGER) % 2 = 1 THEN 'MALE'
          ELSE 'FEMALE'
        END
    END AS consumer_gender
  FROM consumers c
),
age_range_cte AS (
	SELECT
		consumer_id,
		consumer_dob,
		consumer_gender,
    EXTRACT(YEAR FROM AGE(consumer_dob)) AS consumer_age,
    CASE
      WHEN EXTRACT(YEAR FROM AGE(consumer_dob)) < 18 THEN '0-18 yrs'
      WHEN EXTRACT(YEAR FROM AGE(consumer_dob)) BETWEEN 18 AND 24 THEN '18-24 yrs'
      WHEN EXTRACT(YEAR FROM AGE(consumer_dob)) BETWEEN 25 AND 34 THEN '25-34 yrs'
      WHEN EXTRACT(YEAR FROM AGE(consumer_dob)) BETWEEN 35 AND 44 THEN '35-44 yrs'
      WHEN EXTRACT(YEAR FROM AGE(consumer_dob)) BETWEEN 45 AND 54 THEN '45-54 yrs'
      ELSE '55+ yrs'
    END AS consumer_age_range
  FROM dob_cte
)
SELECT 
  l.id AS loan_id,
  l.booked_at AS loan_booked_at_utc,
  l.created_at AS loan_created_at_utc,
  DATE(l.booked_at AT TIME ZONE 'utc' AT TIME ZONE 'africa/cairo') AS loan_booked_date_local,
  ABS(EXTRACT(EPOCH FROM (l.booked_at - l.created_at)) / 60) AS checkout_time_minutes,
  active_ls.created_at AS loan_status_activated_at_utc,
  cancelled_ls.created_at AS loan_status_cancelled_at_utc,
  early_ls.created_at AS loan_status_early_settled_at_utc,
  (principal_journal.amount / 100::FLOAT) + (co.down_payment::FLOAT / 100::FLOAT) AS basket_value,
  (co.down_payment / 100::FLOAT) AS loan_downpayment,
  (principal_journal.amount / 100::FLOAT) AS loan_financed_amount,
  interest_journal.amount / 100::FLOAT AS loan_expected_interest_amount,
  l.financial_product_key AS linked_fp_key,
  l.financial_product_version AS linked_fp_version,
  (SUBSTRING(co.tenure FROM '^[0-9]+'))::INTEGER  AS linked_fp_selected_tenure,
  co.interest_rate_per_tenure::FLOAT AS tenor_interest_percent,
  co.annual_interest_percentage::FLOAT AS annual_interest_percent,
  CASE WHEN co.annual_interest_percentage::FLOAT = 0.0 THEN FALSE ELSE TRUE END AS is_profit_bearing,
  cb.category AS retail_category,
  l.consumer_id AS consumer_id,
  c.marital_status AS consumer_marital_status,
  c.origination_channel AS consumer_origination_channel,
  c.governorate AS consumer_governorate,
  age_range_cte.consumer_gender AS consumer_gender,
  age_range_cte.consumer_dob AS consumer_dob,
  age_range_cte.consumer_age,
  age_range_cte.consumer_age_range,
  l.merchant_global_id AS merchant_id,
  p.name AS merchant_name,
  p.created_at AS merchant_created_at,
  (p.created_at AT TIME ZONE 'Africa/Cairo' AT TIME ZONE 'UTC') AS merchant_created_at_utc,
  pb.id AS transacted_merchant_branch_id,
  g.name_en AS transacted_merchant_branch_governorate,
  CASE WHEN l.merchant_global_id = '09bebad1-8352-4e77-938e-eed5b16fcdf3' THEN 'BTECH' ELSE 'NON_BTECH' END AS merchant_type,
  ROW_NUMBER() OVER (PARTITION BY l.consumer_id ORDER BY l.booked_at) AS consumer_loan_sequence_number,
  ROW_NUMBER() OVER (PARTITION BY l.merchant_global_id ORDER BY l.booked_at) AS merchant_loan_sequence_number,
  NOW() AS view_last_refreshed_time
FROM loan l
INNER JOIN loan_status active_ls ON l.id = active_ls.loan_id AND active_ls.status = 'ACTIVE'
LEFT OUTER JOIN loan_status cancelled_ls ON l.id = cancelled_ls.loan_id AND cancelled_ls.status = 'CANCELLED'
LEFT OUTER JOIN loan_status early_ls ON l.id = early_ls.loan_id AND early_ls.status = 'EARLY_SETTLED'
INNER JOIN checkout_baskets cb ON cb.loan_id::TEXT = l.id AND cb.status = 'LOAN_ACTIVATED'
INNER JOIN commercial_offer co ON cb.selected_commercial_offer_id::TEXT = co.id
INNER JOIN consumers c ON l.consumer_id = c.id::TEXT
INNER JOIN age_range_cte ON c.id = age_range_cte.consumer_id
INNER JOIN partner_branch pb ON cb.branch_id = pb.id
INNER JOIN governorates g ON g.id = pb.governorate_id
INNER JOIN partner p ON cb.partner_id = p.id
INNER JOIN journal principal_journal ON l.id = principal_journal.loan_id AND principal_journal.account = 'MurabhaPrincipalReceivable' AND principal_journal.direction = 'DEBIT'
INNER JOIN journal interest_journal ON l.id = interest_journal.loan_id AND interest_journal.account = 'MurabhaInterestReceivable' AND interest_journal.direction = 'DEBIT'
WITH NO DATA;

CREATE UNIQUE INDEX ON mv_reporting_loans (loan_id);
REFRESH MATERIALIZED VIEW mv_reporting_loans;