package storage

import (
	"github.com/btechlabs/lms/pkg/cqrs"
	"time"
)

type LoanAccountWriteModel struct {
	cqrs.WriteModel
	CreatedAt                     time.Time `db:"created_at"`
	CreatedBy                     string    `db:"created_by"`
	State                         string    `db:"state"`
	SubState                      string    `db:"sub_state"`
	BorrowerId                    string    `db:"borrower_id"`
	BorrowerRepaymentDayOfMonth   uint32    `db:"borrower_repayment_day_of_month"`
	CommercialOfferId             string    `db:"commercial_offer_id"`
	FinancialProductId            string    `db:"financial_product_id"`
	FinancialProductTenorKey      string    `db:"financial_product_tenor_key"`
	TenorDays                     uint32    `db:"tenor_days"`
	GracePeriodInDays             uint32    `db:"grace_period_in_days"`
	BookedAt                      time.Time `db:"booked_at"`
	MerchantId                    string    `db:"merchant_id"`
	LenderSource                  string    `db:"lender_source"`
	OriginationChannel            string    `db:"origination_channel"`
	AppliedCurrency               string    `db:"currency"`
	FlatRateBasisPoints           uint32    `db:"fr_basis_points"`
	MonthlyEffectiveRate          float64   `db:"monthly_effective_rate"`
	TotalEffectiveRate            float64   `db:"total_effective_rate"`
	AnnualPercentageRate          float64   `db:"annual_percent_rate"`
	VatPercentageBasisPoints      uint32    `db:"vat_basis_points"`
	AdminFeePercentageBasisPoints uint32    `db:"admin_fee_basis_points"`
	EarlySettlementFeeBasisPoints uint32    `db:"es_fee_basis_points"`
	BadDebtFeeBasisPoints         uint32    `db:"bd_allowance_basis_points"`
	RoundingUpEstimatedGainUnits  uint64    `db:"rounding_up_est_gain_units"`
	MonetaryLineItems             []LoanAccountMonetaryLineItemWriteModel
}

type LoanAccountActivateWriteModel struct {
	cqrs.WriteModel
	State            string    `db:"state"`
	SubState         string    `db:"sub_state"`
	LoanStartDate    time.Time `db:"loan_start_date"`
	LoanMaturityDate time.Time `db:"loan_maturity_date"`
}

type LoanAccountEarlySettleWriteModel struct {
	cqrs.WriteModel
	State    string `db:"state"`
	SubState string `db:"sub_state"`
}

type LoanAccountCancelWriteModel struct {
	cqrs.WriteModel
	State    string `db:"state"`
	SubState string `db:"sub_state"`
}

type LoanAccountAmmortisationWriteModel struct {
	LoanAccountId           string     `db:"loan_account_id"`
	InstalmentNumber        uint32     `db:"line_item_sequence"`
	AppliedCurrency         string     `db:"currency"`
	InstalmentDueDate       time.Time  `db:"installment_due_date"`
	GracePeriodEndDate      time.Time  `db:"grace_period_ends_at"`
	LoanBalanceUnits        uint64     `db:"loan_balance_units"`
	PrincipalDue            uint64     `db:"principal_due_units"`
	InterestDue             uint64     `db:"interest_due_units"`
	CumulativeInterest      uint64     `db:"cumulative_interest_units"`
	VatDue                  uint64     `db:"vat_due_units"`
	AdminFeeDue             uint64     `db:"admin_fee_due_units"`
	PenaltyDue              uint64     `db:"penalty_due_units"`
	TotalInstalmentDue      uint64     `db:"total_due_units"`
	RevenueRecognitionJobId int64      `db:"revenue_recognition_job_id"`
	Canceled                bool       `db:"canceled"`
	CanceledAt              *time.Time `db:"canceled_at"`
	CanceledReason          *string    `db:"canceled_reason"`
	CreatedAt               time.Time  `db:"created_at"`
}

type LoanAccountAmmortisationCancelationWriteModel struct {
	LoanAccountId    string    `db:"loan_account_id"`
	InstalmentNumber uint32    `db:"line_item_sequence"`
	CanceledAt       time.Time `db:"canceled_at"`
	CanceledReason   string    `db:"canceled_reason"`
}

type LoanAccountMonetaryLineItemWriteModel struct {
	AmountUnits    uint64 `db:"amount_units"`
	Type           string `db:"type"`
	CollectionType string `db:"collection_type"`
}

type LoanAccountEarlySettlementDetailsWriteModel struct {
	cqrs.WriteModel
	AppliedCurrency         string `db:"applied_currency"`
	Available               bool   `db:"available"`
	PrincipalDueUnits       uint64 `db:"principal_due_units"`
	InterestReceivableUnits uint64 `db:"interest_receivable_units"`
	SettlementFeesDueUnits  uint64 `db:"settlement_fee_units"`
}

type LoanAccountPaymentWriteModel struct {
	LoanAccountId               string    `db:"loan_account_id"`
	PaymentReferenceId          string    `db:"payment_reference_id"`
	AmmortisationLineItemNumber uint32    `db:"ammortisation_line_item_sequence"`
	BookedAt                    time.Time `db:"booked_at"`
	AppliedCurrency             string    `db:"currency"`
	PaidUnits                   uint64    `db:"paid_units"`
	UpdatedByEventID            string    `db:"updated_by_event_id"`
}
