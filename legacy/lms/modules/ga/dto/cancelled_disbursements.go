package dto

import "time"

type CancelledMerchantDisbursements struct {
	ReferenceId                          string
	StartTime                            time.Time
	EndTime                              time.Time
	CancelledMerchantDisbursementRecords []CancelledMerchantDisbursementRecord
}

type CancelledMerchantDisbursementRecord struct {
	MerchantGlobalAccountId string
	MerchantAccountId       int64
	PayableUnits            int64
}
