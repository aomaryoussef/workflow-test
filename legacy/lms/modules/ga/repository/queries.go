package repository

const (
	SelectTransactionSlipQuery = `
SELECT id, loan_id, merchant_account_id, created_at, updated_at, cancelled_for_disbursement
FROM public.merchant_transaction_slip
WHERE loan_id = $1
`

	InsertTransactionSlipCommand = `
INSERT INTO public.merchant_transaction_slip (id, loan_id, order_number, merchant_account_id, payable_units, payable_currency, booking_time, narration_comment, created_at)
VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8, $9)
`
	UpdateTransactionSlipWithPaymentIdCommand = `
UPDATE public.merchant_transaction_slip
SET merchant_payment_id = $1
WHERE id = $2;
`

	CancelTransactionSlipSlipCommand = `
UPDATE public.merchant_transaction_slip
SET cancelled_for_disbursement = TRUE, updated_at = $2
WHERE id = $1
		`

	AggregateTransactionSlipsQuery = `
SELECT
	merchant_account_id,
	payable_currency,
	COALESCE(SUM(CASE WHEN cancelled_for_disbursement = FALSE THEN payable_units ELSE -payable_units END), 0) AS total_units,
	ARRAY_AGG(id) AS transaction_slip_ids
FROM public.merchant_transaction_slip
-- condition 1: if the loan is not cancelled within this disbursement cycle
WHERE (cancelled_for_disbursement IS FALSE AND (booking_time >= $1 AND booking_time <= $2))
-- condition 2: if the loan is cancelled within this disbursement cycle
OR (cancelled_for_disbursement IS TRUE AND booking_time < $1  AND updated_at >= $1 AND updated_at <= $2)
GROUP BY merchant_account_id, payable_currency
`

	InsertMerchantPaymentCommand = `
INSERT INTO public.merchant_payment (id, created_at, payable_units, transaction_date, payable_currency, merchant_account_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, created_at, payable_units, transaction_date, payable_currency, merchant_account_id, serial_id
`
	UpdateMerchantPaymentStatusCommand = `
UPDATE merchant_payment
SET status = $1, status_timestamp = $2
WHERE serial_id = $3
`

	GetBooksAggregatedCommand = `
SELECT
	account,
	type,
	SUM(CASE WHEN direction = 'DEBIT' THEN amount ELSE -amount END)
FROM journal
WHERE booked_at BETWEEN :time_start AND :time_end
GROUP BY account, type
`

	ListJournalEntryIDsCommand = `
SELECT id, type
FROM journal
WHERE booked_at BETWEEN :time_start AND :time_end
`

	AggregateMerchantTransactionsCommand = `
SELECT
	l.merchant_global_id,
	pa.id AS merchant_id,
	SUM(j.amount)
FROM journal j
JOIN loan l ON l.id = j.loan_id
JOIN party_account pa ON pa.global_reference_id = l.merchant_global_id
WHERE j.type = 'PURCHASING_FROM_MERCHANT'
  AND j.account = 'MerchantDue'
  AND j.booked_at BETWEEN :time_start AND :time_end
GROUP BY l.merchant_global_id, pa.id
`

	AggregateMerchantAdminFeesCommand = `
SELECT
	l.merchant_global_id,
	pa.id AS merchant_id,
	SUM(j.amount)
FROM journal j
JOIN loan l ON l.id = j.loan_id
JOIN party_account pa ON pa.global_reference_id = l.merchant_global_id
WHERE j.type = 'ADMIN_FEE'
  AND j.account = 'MerchantDue'
  AND j.booked_at BETWEEN :time_start AND :time_end
GROUP BY l.merchant_global_id, pa.id
	`

	SelectMerchantTransactionSlipCommand = `SELECT id, loan_id, merchant_account_id, created_at, updated_at, cancelled_for_disbursement  FROM public.merchant_transaction_slip WHERE id = $1`

	SelectCollectionsAggregateCommand = `
	select
	    -- regular collections
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'DEBIT' and type = 'COLLECTION' AND account = 'CustomerCollections' THEN 1 ELSE 0 END) AS BIGINT), 0) AS regular_c_debit_customer_collections,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION'  AND account = 'MurabhaPrincipalReceivable' THEN 1 ELSE 0 END) AS BIGINT), 0) AS regular_c_credit_principal_receivable,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION'  AND account = 'MurabhaInterestReceivable' THEN 1 ELSE 0 END) AS BIGINT), 0) AS regular_c_credit_interest_receivable,
		-- early settlement collections
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'DEBIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'CustomerCollections' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_debit_customer_collections,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'DEBIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'MurabhaEarlySettlementAllowance' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_debit_settlement_allowance,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'MurabhaPrincipalReceivable' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_credit_principal_receivable,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'MurabhaInterestReceivable' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_credit_interest_receivable,
		-- early settlement revenue loss
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'DEBIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'MurabhaUnearnedRevenue' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_debit_unearned_revenue,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'MurabhaEarlySettlementAllowance' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_credit_settlement_allowance,
		COALESCE(CAST(SUM(amount * CASE WHEN direction = 'CREDIT' and type = 'COLLECTION_EARLY_SETTLEMENT' AND account = 'InterestRevenue' THEN 1 ELSE 0 END) AS BIGINT), 0) AS early_c_credit_interest_revenue
	from journal
	where booked_at BETWEEN :time_start AND :time_end and
		(type = 'COLLECTION' or type = 'COLLECTION_EARLY_SETTLEMENT')
	`
)

const SelectLoanCancellationAggregateCommand = `
	WITH journal_aggregations AS (
		SELECT
			l.id AS loan_id,
			-- Murabha Purchases
			cast(sum(j.amount * CASE WHEN j.type = 'SELLING_TO_MERCHANT' AND j.direction = 'CREDIT' AND j.account = 'MurabhaPurchase' THEN 1 ELSE 0 END) AS BIGINT) AS murabha_purchase_credit,
			cast(sum(j.amount * CASE WHEN j.type = 'SELLING_TO_MERCHANT' AND j.direction = 'DEBIT' AND j.account = 'MerchantDue' THEN 1 ELSE 0 END) AS BIGINT) AS merchant_due_debit,
			-- Principal
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'CREDIT' AND j.account = 'MurabhaPrincipalReceivable' THEN 1 ELSE 0 END) AS BIGINT) AS murabha_principal_receivable_credit,
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'DEBIT' AND j.account = 'MurabhaPurchase' THEN 1 ELSE 0 END) AS BIGINT) AS murabha_purchase_debit,
			-- Interest
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'CREDIT' AND j.account = 'MurabhaInterestReceivable' THEN 1 ELSE 0 END) AS BIGINT) AS murabha_interest_receivable_credit,
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'DEBIT' AND j.account = 'MurabhaUnearnedRevenue' THEN 1 ELSE 0 END) AS BIGINT) AS murabha_unearned_revenue_debit,
			-- Bad Debt (doubtful allowance)
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'CREDIT' AND j.account = 'Doubtful' THEN 1 ELSE 0 END) AS BIGINT) AS doubtful_allowance_credit,
			cast(sum(j.amount * CASE WHEN j.type = 'LOAN_CANCELLATION' AND j.direction = 'DEBIT' AND j.account = 'DoubtfulReceivable' THEN 1 ELSE 0 END) AS BIGINT) AS doubtful_allowance_debit,
			-- Fees
			cast(sum(j.amount * CASE WHEN j.type = 'REVERSE_ADMIN_FEE' AND j.direction = 'CREDIT' AND j.account = 'MerchantDue' THEN 1 ELSE 0 END) AS BIGINT) AS merchant_due_credit,
			cast(sum(j.amount * CASE WHEN j.type = 'REVERSE_ADMIN_FEE' AND j.direction = 'DEBIT' AND j.account = 'AdminFeeReceivable' THEN 1 ELSE 0 END) AS BIGINT) AS admin_fee_debit,
			cast(sum(j.amount * CASE WHEN j.type = 'REVERSE_ADMIN_FEE' AND j.direction = 'DEBIT' AND j.account = 'TaxDue' THEN 1 ELSE 0 END) AS BIGINT) AS tax_due_debit
		FROM loan l
		INNER JOIN loan_status ls on ls.loan_id = l.id and ls.status = 'CANCELLED'
		INNER JOIN journal j ON l.id = j.loan_id
		INNER JOIN merchant_transaction_slip mts ON mts.loan_id = l.id
		WHERE mts.cancelled_for_disbursement IS TRUE
		AND ls.created_at >= :time_start
		AND ls.created_at <= :time_end
		GROUP BY l.id
	)
	SELECT
		mts.id                                                          AS merchant_transaction_slip_id,
		pa.global_reference_id                                         	AS merchant_global_account_id,
		pa.id                                                           AS merchant_id,
		l.id                                                            AS loan_id,
		mp.id                                                           AS merchant_payment_id,
		CASE WHEN mp.id IS NULL THEN 'NOT_INITIATED' ELSE COALESCE(mp.status, 'IN_PROGRESS') END AS merchant_payment_status,
		mp.transaction_date                                             AS payment_request_created_date,
		mts.payable_units                                               AS payable_units,
		ja.murabha_purchase_credit,
		ja.merchant_due_debit,
		ja.murabha_principal_receivable_credit,
		ja.murabha_purchase_debit,
		ja.murabha_interest_receivable_credit,
		ja.murabha_unearned_revenue_debit,
		ja.doubtful_allowance_credit,
		ja.doubtful_allowance_debit,
		ja.merchant_due_credit,
		ja.admin_fee_debit,
		ja.tax_due_debit
	FROM journal_aggregations ja
	INNER JOIN loan l ON ja.loan_id = l.id
	INNER JOIN merchant_transaction_slip mts ON l.id = mts.loan_id
	INNER JOIN party_account pa ON l.merchant_global_id = pa.global_reference_id
	LEFT OUTER JOIN merchant_payment mp ON mts.merchant_payment_id = mp.id
  `

const SelectMerchantCancelInvoicesCommand = `
	WITH merchant_payable_units AS (
		SELECT mts.merchant_account_id,
					 CAST(SUM(mts.payable_units) AS BIGINT) AS payable_units
		FROM public.merchant_transaction_slip mts
		INNER JOIN public.merchant_payment mp ON mts.merchant_payment_id = mp.id
		WHERE mts.cancelled_for_disbursement IS TRUE
		AND mts.updated_at >= :time_start
		AND mts.updated_at <= :time_end
		AND mp.success_ga_posting IS FALSE
		GROUP BY mts.merchant_account_id
	)
	SELECT pa.global_reference_id AS merchant_global_account_id,
				 pa.id AS merchant_account_id,
				 mpu.payable_units
	FROM merchant_payable_units mpu
	INNER JOIN public.party_account pa ON mpu.merchant_account_id = pa.global_reference_id
  `
