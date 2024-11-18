package usecase

import (
	"context"
	"errors"

	"github.com/btechlabs/lms-lite/modules/financialproduct/domain"
	"github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	"github.com/btechlabs/lms-lite/modules/financialproduct/repository"
	"github.com/samber/lo"
)

type FinancialProductUseCase interface {
	RetrieveAllActiveProducts(ctx context.Context) []*domain.FinancialProduct
	GetProduct(ctx context.Context, productKey string, productVersion string, includeInactive bool) (*domain.FinancialProduct, error)
	GetProducts(ctx context.Context, financialProductIdentifiers []domain.FinancialProductIdentifier, includeInactive bool) ([]*domain.FinancialProduct, error)
	CalculateOfferDetails(ctx context.Context, offerDetailsRequest *dto.CalculateOfferDetailsRequest) (*domain.FinancialProduct, error)
	CalculateAmmortizationSchedule(ctx context.Context, asr dto.AmmortizationScheduleRequest) (*domain.AmmortizationSchedule, error)
}

type financialProductUseCase struct {
	repo       repository.FinancialProductRepository
}

func NewFinancialProductUseCase(repo repository.FinancialProductRepository) FinancialProductUseCase {
	useCase := &financialProductUseCase{
		repo:       repo,
	}
	return useCase
}

// RetrieveAllActiveProducts retrieves all active financial products.
// In most cases this will be used by the product selector component
// to find the right product for the given consumer / request
func (u *financialProductUseCase) RetrieveAllActiveProducts(ctx context.Context) []*domain.FinancialProduct {
	products := u.repo.GetAllActiveFinancialProducts(ctx)
	return products
}

func (u *financialProductUseCase) GetProducts(ctx context.Context, financialProductIdentifiers []domain.FinancialProductIdentifier, includeInactive bool) ([]*domain.FinancialProduct, error) {
	products := lo.FilterMap(financialProductIdentifiers, func(x domain.FinancialProductIdentifier, _ int) (*domain.FinancialProduct, bool) {
		product, err := u.repo.GetFinancialProduct(ctx, x.ProductKey, x.ProductVersion, includeInactive)
		if err != nil {
			return nil, false // TODO: should we error if a product is not found, instead of just skipping the product?
		}
		return product, true
	})

	return products, nil
}

func (u *financialProductUseCase) GetProduct(ctx context.Context, productKey string, productVersion string, includeInactive bool) (*domain.FinancialProduct, error) {
	product, err := u.repo.GetFinancialProduct(ctx, productKey, productVersion, includeInactive)
	return product, err
}

// CalculateOfferDetails calculates a detailed view of charges,
// payment schedules and other related detailed that are important
// to bring transparency to the consumer's loan application.
func (u *financialProductUseCase) CalculateOfferDetails(ctx context.Context, offerDetailsRequest *dto.CalculateOfferDetailsRequest) (*domain.FinancialProduct, error) {
	return nil, errors.New("not implemented")
}

func (u *financialProductUseCase) CalculateAmmortizationSchedule(ctx context.Context, asr dto.AmmortizationScheduleRequest) (*domain.AmmortizationSchedule, error) {
	product, err := u.GetProduct(ctx, asr.FinancialProductKey, asr.FinancialProductVersion, true)
	if err != nil {
		return nil, err
	}

	schedule, err := product.CreateAmmortizationSchedule(asr.NetPrincipalAmount, asr.TenorKey, asr.LoanBookingTimeUTC, asr.RepaymentDay)
	if err != nil {
		return nil, err
	}

	ammortizationSchedule := &domain.AmmortizationSchedule{
		NetPrincipalAmount:      asr.NetPrincipalAmount,
		FinancialProductKey:     asr.FinancialProductKey,
		FinancialProductVersion: asr.FinancialProductVersion,
		TenorKey:                asr.TenorKey,
		PaymentSchedule:         schedule,
	}
	return ammortizationSchedule, nil
}
