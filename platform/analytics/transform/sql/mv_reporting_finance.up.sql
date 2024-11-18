DROP MATERIALIZED VIEW IF EXISTS mv_reporting_finance;

CREATE MATERIALIZED VIEW mv_reporting_finance AS
WITH active_loans_month_year_cte AS (
	SELECT DISTINCT
	  l.id AS loan_id
	  , EXTRACT (MONTH FROM l.booked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo') AS month_local
	  , EXTRACT (YEAR FROM l.booked_at AT TIME ZONE 'UTC' AT TIME ZONE 'Africa/Cairo') AS year_local
	FROM loan l
	INNER JOIN loan_status active_ls ON l.id = active_ls.loan_id AND active_ls.status = 'ACTIVE'
	LEFT OUTER JOIN loan_status cancelled_ls ON l.id = cancelled_ls.loan_id AND cancelled_ls.status = 'CANCELLED'
	LEFT OUTER JOIN loan_status early_ls ON l.id = early_ls.loan_id AND early_ls.status = 'EARLY_SETTLED'
	WHERE cancelled_ls.created_at IS NULL
	AND active_ls.created_at IS NOT NULL
), 
loans_booked_cte AS (
	SELECT 
	  (SUBSTRING(co.tenure FROM '^[0-9]+'))::INTEGER  AS tenor
	  , cte.month_local
	  , cte.year_local
	  , SUM((principal_journal.amount / 100::FLOAT) + (co.down_payment::FLOAT / 100::FLOAT)) AS total_basket_value
	  , SUM(co.down_payment / 100::FLOAT) AS total_loan_downpayment
	  , SUM(principal_journal.amount / 100::FLOAT) AS total_loan_financed_amount
	  , SUM(interest_journal.amount / 100::FLOAT) AS total_loan_expected_interest_amount
	FROM active_loans_month_year_cte cte
	INNER JOIN loan l ON l.id = cte.loan_id
	INNER JOIN checkout_baskets cb ON cb.loan_id::TEXT = l.id AND cb.status = 'LOAN_ACTIVATED'
	INNER JOIN commercial_offer co ON cb.selected_commercial_offer_id::TEXT = co.id
	INNER JOIN journal principal_journal ON l.id = principal_journal.loan_id AND principal_journal.account = 'MurabhaPrincipalReceivable' AND principal_journal.direction = 'DEBIT'
	INNER JOIN journal interest_journal ON l.id = interest_journal.loan_id AND interest_journal.account = 'MurabhaInterestReceivable' AND interest_journal.direction = 'DEBIT'
	GROUP BY tenor, cte.month_local, cte.year_local
	ORDER BY tenor
),
cumulative_figures_cte AS (
	SELECT
		month_local
		, year_local
		, SUM(total_loan_financed_amount) AS summation_total_loan_financed_amount
	FROM loans_booked_cte
	GROUP BY month_local, year_local
),
portfolio_weight_cte AS (
	SELECT 
		lbc.month_local
		, lbc.year_local
		, lbc.tenor
		, lbc.total_basket_value
		, lbc.total_loan_downpayment
		, lbc.total_loan_financed_amount
		, lbc.total_loan_expected_interest_amount
		, ((lbc.total_loan_expected_interest_amount::FLOAT / lbc.tenor::FLOAT) * 12) AS annualised_interest
		, ((((lbc.total_loan_expected_interest_amount::FLOAT / lbc.tenor::FLOAT) * 12) / lbc.total_loan_financed_amount::FLOAT) * 100) AS decreasing_apr
		, ((lbc.total_loan_financed_amount::FLOAT / cf.summation_total_loan_financed_amount::FLOAT) * 100) AS portfolio_weight
	FROM loans_booked_cte lbc
	INNER JOIN cumulative_figures_cte cf ON lbc.month_local = cf.month_local AND lbc.year_local = cf.year_local
),
decreasing_weighted_apr AS (
	SELECT 
		month_local
		, year_local
		, tenor
		, total_basket_value
		, total_loan_downpayment
		, total_loan_financed_amount
		, total_loan_expected_interest_amount
		, annualised_interest
		, decreasing_apr
		, portfolio_weight
		, ((decreasing_apr::FLOAT / portfolio_weight::FLOAT) * 100) AS weighted_decreasing_apr
		, ((portfolio_weight::FLOAT * tenor::FLOAT) / 100) AS weighted_avg_tenor
		, NOW() AS view_last_refreshed_time
	FROM portfolio_weight_cte
) 
SELECT * FROM decreasing_weighted_apr
WITH NO DATA;

CREATE UNIQUE INDEX ON mv_reporting_finance (month_local, year_local, tenor);

REFRESH MATERIALIZED VIEW mv_reporting_finance;