DROP MATERIALIZED VIEW IF EXISTS mv_merchant_payments;

CREATE MATERIALIZED VIEW mv_merchant_payments AS
WITH sla_calculation AS (
  SELECT
    id,
    merchant_account_id,
    payable_amount,
    (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date AS local_transaction_date,
    status_timestamp,
    status,
    -- Determine the expected payment date based on the local_transaction_date and cast it to DATE
    CASE
      WHEN EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date) IN (0, 1, 2) THEN  -- Sun (0), Mon (1), Tue (2)
        -- Add 3 days to local_transaction_date to get the payment deadline (same week Thursday)
        ((transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date + INTERVAL '3 days')::date
      WHEN EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date) IN (3, 4, 5, 6) THEN  -- Wed (3), Thu (4), Fri (5), Sat (6)
        -- Calculate the next Monday
        ((transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date + (7 - EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date))::int + INTERVAL '1 day')::date
    END AS expected_payment_date,
    -- Check if SLA is breached
    CASE
      WHEN status IS NULL AND expected_payment_date < CURRENT_DATE THEN 1  -- If status is NULL and expected_payment_date is less than today, consider it as a breach
      WHEN status IS NOT NULL AND status_timestamp::date > expected_payment_date THEN 1  -- If payment is made after the expected payment date, consider it as a breach
      ELSE 0
    END AS sla_breach
  FROM (
    SELECT
      id,
      merchant_account_id,
      payable_units / 100::FLOAT AS payable_amount,
      transaction_date,
      status_timestamp,
      status,
      (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date AS local_transaction_date,
      CASE
        WHEN EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date) IN (0, 1, 2) THEN  -- Sun (0), Mon (1), Tue (2)
          -- Add 3 days to local_transaction_date to get the payment deadline (same week Thursday)
          ((transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date + INTERVAL '3 days')::date
        WHEN EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date) IN (3, 4, 5, 6) THEN  -- Wed (3), Thu (4), Fri (5), Sat (6)
          -- Calculate the next Monday
          ((transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date + (7 - EXTRACT(DOW FROM (transaction_date AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo')::date))::int + INTERVAL '1 day')::date
      END AS expected_payment_date
    FROM public.merchant_payment
  ) AS subquery
)
SELECT 
	p.id AS merchant_id
	, p.name AS merchant_name
	, sla_calc.id AS merchant_payment_id
	, sla_calc.payable_amount
	, sla_calc.local_transaction_date
  , sla_calc.status_timestamp
  , sla_calc.status
  , sla_calc.expected_payment_date
  , sla_calc.sla_breach
  , NOW() AS view_last_refreshed_time
FROM sla_calculation sla_calc
INNER JOIN partner p ON sla_calc.merchant_account_id = p.id::TEXT
WITH NO DATA;

CREATE UNIQUE INDEX ON mv_merchant_payments (merchant_id, merchant_payment_id);

REFRESH MATERIALIZED VIEW mv_merchant_payments;