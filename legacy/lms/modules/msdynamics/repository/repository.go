package repository

import (
	"context"

	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/modules/msdynamics/domain"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
)

type MSDynamicsRepository interface {
	GetChartofAccountsMap() *ChartOfAccountsMap

	OpenMerchantAccount(ctx context.Context, tracingId string, account *domain.MerchantAccount) (*domain.MerchantAccount, error)
	NewMerchantInvoices(ctx context.Context, tracingId string, invoices []*domain.MerchantInvoice) (dynamics *dto.DynamicsRequestResponse, err error)
	SaveGeneralJournalEntries(ctx context.Context, tracingId string, entries []*domain.GeneralJournal) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionMyloTreasuryFawryChannel(ctx context.Context, input domain.ConsumerCollectionFawryChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookConsumerCollectionBTechTreasury(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error)
	BookCollectionMyloTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error)
	BookCollectionBTechTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error)
	PostAggregatedCollectionsAtEndOfDay(ctx context.Context, input dto.PostAggregatedCollectionRequest) (dynamics *dto.DynamicsRequestResponse, err error)
	PostAggregatedLoanCancellationsAtEndOfDay(ctx context.Context, input PostAggregatedLoanCancellationRequest) (dynamics *dto.DynamicsRequestResponse, err error)
	PostCancelledInvoicesAccount(ctx context.Context, input gaDto.CancelledMerchantDisbursements) (dynamics *dto.DynamicsRequestResponse, err error)
}
