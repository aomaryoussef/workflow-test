package domain

type EarlySettlementDetails struct {
	IsEarlySettlementAvailable    bool   `json:"available"`
	EarlySettlementPrincipalDue   *Money `json:"principal_due,omitempty"`
	EarlySettlementFeesDue        *Money `json:"fees_due,omitempty"`
	EarlySettlementTotalAmountDue *Money `json:"total_due,omitempty"`
}
