-- This is a CRON Job scheduled on the reporting DB server
-- for refreshing the materialised views used for reporting 
-- and analytics dashboard.
-- This CRON Schedule is created manually once.
--
-- Note to Engineers:
-- 1. If you add a new view, remember to refresh this cron schedule manually.
-- 2. For DB Access, get support from Platform Team
--
-- Note to Data Analysts:
-- 1. Get the latest status of the cron run: use 
--      `SELECT * from cron.job_run_details ORDER BY start_time DESC limit 4`
-- This will give the details of the last 4 (or X) runs.
-- 2. Put this view on Grafana to ensure every Business Stakeholder knows 
--      the latest data state
--
SELECT cron.schedule('mylo-mv_reporting_loans-refresh-3hrs', '0 */3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_reporting_loans');
SELECT cron.schedule('mylo-mv_merchant_payments-refresh-3hrs', '0 */3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_merchant_payments');
SELECT cron.schedule('mylo-mv_reporting_finance-refresh-3hrs', '0 */3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_reporting_finance');
SELECT cron.schedule('mylo-mv_reporting_loans_schedule-refresh-3hrs', '0 */3 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_reporting_loans_schedule');