DROP MATERIALIZED VIEW IF EXISTS mv_reporting_loans_schedule;

CREATE MATERIALIZED VIEW mv_reporting_loans_schedule AS 
	WITH monthly_schedule_cte AS (
    SELECT 
        ls_1.id AS loan_schedule_id,
    	ls_1.loan_id,
        ls_1.due_date::date AS due_date,
        (ls_1.due_principal::double precision / 100::double precision) AS due_principal,
        (ls_1.due_interest::double precision / 100::double precision) AS due_interest,
        (ls_1.loan_balance::double precision / 100::double precision) AS remaining_balance
        FROM loan_schedule ls_1
        WHERE ls_1.is_cancelled IS FALSE
    ), reducing_balance_cte AS (
    SELECT 
        ms.loan_schedule_id,
    	ms.loan_id,
        ms.due_date,
        principal_journal.amount::double precision / 100::double precision AS total_financed_amount,
        ms.due_principal,
        ms.due_interest,
        sum(ms.due_principal) OVER (PARTITION BY ms.loan_id ORDER BY ms.due_date) AS cumulative_principal,
        ms.remaining_balance
        FROM monthly_schedule_cte ms
        INNER JOIN journal principal_journal ON ms.loan_id::text = principal_journal.loan_id::text 
        	AND principal_journal.account::text = 'MurabhaPrincipalReceivable'::text 
        	AND principal_journal.direction::text = 'DEBIT'::TEXT
        	AND principal_journal.type = 'LOAN_ACTIVATION'
    )
 SELECT
    rb.loan_schedule_id,
 	rb.loan_id,
    rb.due_date,
    rb.total_financed_amount,
    rb.due_principal,
    rb.due_interest,
    rb.cumulative_principal,
    rb.remaining_balance,
    rb.due_interest / rb.remaining_balance * 12::double precision AS reducing_apr,
    ((ls.grace_period_end_date AT TIME ZONE 'UTC'::text) AT TIME ZONE 'Africa/Cairo'::text)::date AS grace_period_ends_on,
    ((ls.paid_date AT TIME ZONE 'UTC'::text) AT TIME ZONE 'Africa/Cairo'::text)::date AS paid_date,
    ls.paid_principal::double precision / 100::double precision AS paid_principal,
    ls.paid_interest::double precision / 100::double precision AS paid_interest
FROM reducing_balance_cte rb
INNER JOIN loan_schedule ls ON rb.loan_schedule_id = ls.id AND ls.is_cancelled IS FALSE
WITH DATA;

CREATE UNIQUE INDEX ON mv_reporting_loans_schedule (loan_schedule_id);

REFRESH MATERIALIZED VIEW mv_reporting_loans_schedule;