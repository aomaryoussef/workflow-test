package storage

import (
	"github.com/btechlabs/lms/pkg/cqrs"
	"time"
)

type FinancialProductWriteModel struct {
	cqrs.WriteModel
	State                                string                  `db:"state"`
	Name                                 string                  `db:"name"`
	Description                          string                  `db:"description"`
	ActiveSince                          time.Time               `db:"active_since"`
	ActiveUntil                          time.Time               `db:"active_until"`
	GracePeriodInDays                    int                     `db:"grace_period_in_days"`
	MinPrincipalUnits                    int                     `db:"min_principal_units"`
	MinPrincipalCurrency                 string                  `db:"min_principal_currency"`
	MaxPrincipalUnits                    int                     `db:"max_principal_units"`
	MaxPrincipalCurrency                 string                  `db:"max_principal_currency"`
	MinDownPaymentBasisPoints            int                     `db:"min_down_payment_basis_points"`
	MaxDownPaymentBasisPoints            int                     `db:"max_down_payment_basis_points"`
	VatPercentBasisPoints                int                     `db:"vat_percent_basis_points"`
	AdminFeePercentBasisPoints           int                     `db:"admin_fee_percent_basis_points"`
	EarlySettlementFeePercentBasisPoints int                     `db:"es_fee_percent_basis_points"`
	BadDebtProvisionPercentBasisPoints   int                     `db:"bd_allowance_percent_basis_points"`
	Tenors                               []FinancialProductTenor `db:"tenors"`
	CreatedAt                            time.Time               `db:"created_at"`
	CreatedBy                            string                  `db:"created_by"`
}

type FinancialProductTenor struct {
	TenorKey                   string `json:"tenor_key"`
	DurationInDays             int    `json:"duration_in_days"`
	InterestPercentBasisPoints int    `json:"interest_percent_basis_points"`
	AdminFeePercentBasisPoints int    `json:"admin_fee_percent_basis_points"`
}

type FinancialProductUpdateStateWriteModel struct {
	cqrs.WriteModel
	State string `db:"state"`
}
