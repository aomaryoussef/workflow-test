package repository

import (
	"context"
	"errors"

	"github.com/btechlabs/lms-lite/modules/financialproduct/domain"
)

var (
	ErrActiveFinancialProductNotFound = errors.New("no active financial product found by key and version")
)

type FinancialProductRepository interface {
	GetAllActiveFinancialProducts(ctx context.Context) (fps []*domain.FinancialProduct)
	GetFinancialProduct(ctx context.Context, key string, version string, includeInactive bool) (fp *domain.FinancialProduct, err error)
}
