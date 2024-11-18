package storage

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/doug-martin/goqu/v9"
)

func InsertNewFinancialProduct(ctx context.Context, tx sql_driver.Tx, wm FinancialProductWriteModel) error {
	log := logging.WithContext(ctx)
	tenorsJson, err := json.Marshal(wm.Tenors)
	if err != nil {
		return err
	}
	financialProductRecord := goqu.Record{
		"id":                  wm.Id,
		"version":             wm.Version,
		"created_at":          wm.CreatedAt,
		"updated_at":          wm.UpdatedAt,
		"created_by":          wm.CreatedBy,
		"updated_by":          wm.UpdatedBy,
		"updated_by_event_id": wm.UpdatedByEventID,

		"state":                             wm.State,
		"name":                              wm.Name,
		"description":                       wm.Description,
		"active_since":                      wm.ActiveSince,
		"active_until":                      wm.ActiveUntil,
		"grace_period_in_days":              wm.GracePeriodInDays,
		"min_principal_units":               wm.MinPrincipalUnits,
		"min_principal_currency":            wm.MinPrincipalCurrency,
		"max_principal_units":               wm.MaxPrincipalUnits,
		"max_principal_currency":            wm.MaxPrincipalCurrency,
		"min_down_payment_basis_points":     wm.MinDownPaymentBasisPoints,
		"max_down_payment_basis_points":     wm.MaxDownPaymentBasisPoints,
		"vat_percent_basis_points":          wm.VatPercentBasisPoints,
		"admin_fee_percent_basis_points":    wm.AdminFeePercentBasisPoints,
		"es_fee_percent_basis_points":       wm.EarlySettlementFeePercentBasisPoints,
		"bd_allowance_percent_basis_points": wm.BadDebtProvisionPercentBasisPoints,
		"tenors":                            tenorsJson,
	}

	// Insert financial wm
	sql, args, err := sql_driver.GoquPgDialect.Insert("financial_product").Rows(financialProductRecord).ToSQL()
	if err != nil {
		return err
	}
	_, err = tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}
	log.Debug("inserted financial wm record")
	return nil
}

func UpdateExistingFinancialProduct(ctx context.Context, tx sql_driver.Tx, wm FinancialProductWriteModel) error {
	log := logging.WithContext(ctx)
	tenorsJson, err := json.Marshal(wm.Tenors)
	if err != nil {
		return err
	}
	financialProductRecord := goqu.Record{
		"version":                           wm.Version,
		"updated_at":                        wm.UpdatedAt,
		"updated_by":                        wm.UpdatedBy,
		"updated_by_event_id":               wm.UpdatedByEventID,
		"name":                              wm.Name,
		"description":                       wm.Description,
		"active_since":                      wm.ActiveSince,
		"active_until":                      wm.ActiveUntil,
		"grace_period_in_days":              wm.GracePeriodInDays,
		"min_principal_units":               wm.MinPrincipalUnits,
		"min_principal_currency":            wm.MinPrincipalCurrency,
		"max_principal_units":               wm.MaxPrincipalUnits,
		"max_principal_currency":            wm.MaxPrincipalCurrency,
		"min_down_payment_basis_points":     wm.MinDownPaymentBasisPoints,
		"max_down_payment_basis_points":     wm.MaxDownPaymentBasisPoints,
		"vat_percent_basis_points":          wm.VatPercentBasisPoints,
		"admin_fee_percent_basis_points":    wm.AdminFeePercentBasisPoints,
		"es_fee_percent_basis_points":       wm.EarlySettlementFeePercentBasisPoints,
		"bd_allowance_percent_basis_points": wm.BadDebtProvisionPercentBasisPoints,
		"tenors":                            tenorsJson,
	}
	// Update financial wm
	sql, args, err := sql_driver.GoquPgDialect.
		From("financial_product").
		Update().
		Set(financialProductRecord).
		Where(goqu.And(
			goqu.I("id").Eq(wm.Id),
			goqu.C("version").Eq(wm.Version-1),
		)).
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return sql_driver.ErrVersionMismatchOptimisticLocking
	}

	log.Debug("updated financial wm record")
	return nil
}

func UpdateState(ctx context.Context, tx sql_driver.Tx, wm FinancialProductUpdateStateWriteModel) error {
	log := logging.WithContext(ctx)

	sql, args, err := sql_driver.GoquPgDialect.
		From("financial_product").
		Update().
		Set(goqu.Record{
			"version":             wm.Version,
			"state":               wm.State,
			"updated_at":          wm.UpdatedAt,
			"updated_by":          wm.UpdatedBy,
			"updated_by_event_id": wm.UpdatedByEventID,
		}).
		Where(goqu.And(
			goqu.I("id").Eq(wm.Id),
			goqu.C("version").Eq(wm.Version-1),
		)).
		Returning().
		ToSQL()
	if err != nil {
		return err
	}
	commandTag, err := tx.Exec(ctx, sql, args...)
	if err != nil {
		return err
	}

	if commandTag.RowsAffected() == 0 {
		return sql_driver.ErrVersionMismatchOptimisticLocking
	}

	log.Debug(fmt.Sprintf("updated financial product: %s to state: %s", wm.Id, wm.State))
	return nil
}
