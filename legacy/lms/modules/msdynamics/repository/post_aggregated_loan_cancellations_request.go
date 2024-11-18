package repository

import "time"

type PostAggregatedLoanCancellationRequest struct {
	ReferenceId                               string
	StartTime                                 time.Time
	EndTime                                   time.Time
	StartTimeUTC                              time.Time
	EndTimeUTC                                time.Time
	AggregatedMerchantLoanCancellationRecords []AggregatedMerchantLoanCancellationRecord
}

type AggregatedMerchantLoanCancellationRecord struct {
	MerchantGlobalId                 string
	MerchantId                       int
	MurabhaPurchaseCredit            int64
	MerchantDueDebit                 int64
	MurabhaPrincipalReceivableCredit int64
	MurabhaPurchaseDebit             int64
	MurabhaInterestReceivableCredit  int64
	MurabhaUnearnedRevenueDebit      int64
	DoubtfulAllowanceCredit          int64
	DoubtfulAllowanceDebit           int64
	MerchantDueCredit                int64
	AdminFeeDebit                    int64
	TaxDueDebit                      int64
}
