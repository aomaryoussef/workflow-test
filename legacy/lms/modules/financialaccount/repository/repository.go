package repository

import (
	"context"

	"github.com/btechlabs/lms-lite/modules/financialaccount/domain"
)

type PartyAccountRepository interface {
	FindAccountByGlobalReferenceID(ctx context.Context, id string) (*domain.PartyAccount, error)
	FindMerchantByGlobalReferenceID(ctx context.Context, id string) (*domain.PartyAccount, error)
	FindConsumerByGlobalReferenceID(ctx context.Context, id string) (*domain.PartyAccount, error)
	Create(ctx context.Context, partyAccount *domain.PartyAccount) error
	UpdateStatus(ctx context.Context, id string, status domain.PartyAccountStatus) error
}
