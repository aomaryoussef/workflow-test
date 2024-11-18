package dto

import (
	"time"
)

type PostAggregatedCollectionRequest struct {
	DateTimeRange   PostAggregatedCollectionRequestDateTimeRange    `json:"request" mapstructure:"request"`
	AccountPosition PostAggregatedCollectionRequestAccountPositions `json:"response" mapstructure:"response"`
	ReferenceId     string                                          `json:"reference_id" mapstructure:"reference_id"`
}

type PostAggregatedCollectionRequestDateTimeRange struct {
	StartTimeUTC   string `json:"start_time_utc" mapstructure:"start_time_utc"`
	EndTimeUTC     string `json:"end_time_utc" mapstructure:"end_time_utc"`
	StartTimeGiven string `json:"start_time_given" mapstructure:"start_time_given"`
	EndTimeGiven   string `json:"end_time_given" mapstructure:"end_time_given"`
}
type PostAggregatedCollectionRequestAccountPositions struct {
	RegularCollection          RegularCollection          `json:"regular_collection" mapstructure:"regular_collection"`
	EarlySettlementCollection  EarlySettlementCollection  `json:"early_settlement_collection" mapstructure:"early_settlement_collection"`
	EarlySettlementRevenueLoss EarlySettlementRevenueLoss `json:"early_settlement_revenue_loss" mapstructure:"early_settlement_revenue_loss"`
}

type RegularCollection struct {
	DebitCustomerCollection            uint64 `json:"debit_customer_collections" mapstructure:"debit_customer_collections"`
	CreditMurabahaPrincipalReceivables uint64 `json:"credit_principal_receivable" mapstructure:"credit_principal_receivable"`
	CreditMurabahaInterestReceivables  uint64 `json:"credit_interest_receivable" mapstructure:"credit_interest_receivable"`
}
type EarlySettlementCollection struct {
	DebitCustomerCollection            uint64 `json:"debit_customer_collections" mapstructure:"debit_customer_collections"`
	DebitMurabahaSettlementAllowance   uint64 `json:"debit_settlement_allowance" mapstructure:"debit_settlement_allowance"`
	CreditMurabahaPrincipalReceivables uint64 `json:"credit_principal_receivable" mapstructure:"credit_principal_receivable"`
	CreditMurabahaInterestReceivables  uint64 `json:"credit_interest_receivable" mapstructure:"credit_interest_receivable"`
}
type EarlySettlementRevenueLoss struct {
	DebitUnearnedRevenue              uint64 `json:"debit_unearned_revenue" mapstructure:"debit_unearned_revenue"`
	CreditMurabahaSettlementAllowance uint64 `json:"credit_settlement_allowance" mapstructure:"credit_settlement_allowance"`
	CreditInterestRevenue             uint64 `json:"credit_interest_revenue" mapstructure:"credit_interest_revenue"`
}

func (r *PostAggregatedCollectionRequestDateTimeRange) StartTimeUTCAsTime() (time.Time, error) {
	t, err := time.Parse(time.RFC3339, r.StartTimeUTC)
	return t, err
}

func (r *PostAggregatedCollectionRequestDateTimeRange) EndTimeUTCAsTime() (time.Time, error) {
	t, err := time.Parse(time.RFC3339, r.EndTimeUTC)
	return t, err
}

func (r *PostAggregatedCollectionRequestDateTimeRange) StartTimeGivenAsTime() (time.Time, error) {
	t, err := time.Parse(time.RFC3339, r.StartTimeGiven)
	return t, err
}

func (r *PostAggregatedCollectionRequestDateTimeRange) EndTimeGivenAsTime() (time.Time, error) {
	t, err := time.Parse(time.RFC3339, r.EndTimeGiven)
	return t, err
}
