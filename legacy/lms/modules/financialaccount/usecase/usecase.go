package usecase

import (
	"context"
	"fmt"

	"github.com/btechlabs/lms-lite/modules/financialaccount/domain"
	"github.com/btechlabs/lms-lite/modules/financialaccount/repository"
	"github.com/lib/pq"
)

type FinancialAccountUseCase interface {
	CreateFinancialAccount(ctx context.Context, globalReferenceId string, accountType domain.PartyAccountType) (int, error)
	ActivateFinancialAccount(ctx context.Context, globalReferenceId string) error
	DeactivateFinancialAccount(ctx context.Context, globalReferenceId string) error
	FindMerchantAccount(ctx context.Context, globalReferenceId string) (*domain.PartyAccount, error)
	FindConsumerAccount(ctx context.Context, globalReferenceId string) (*domain.PartyAccount, error)
}

var _ FinancialAccountUseCase = (*financialAccountUseCase)(nil)

type financialAccountUseCase struct {
	repo repository.PartyAccountRepository
}

func NewFinancialAccountUseCase(repo repository.PartyAccountRepository) *financialAccountUseCase {
	return &financialAccountUseCase{
		repo: repo,
	}
}

func (u *financialAccountUseCase) CreateFinancialAccount(ctx context.Context, globalReferenceId string, accountType domain.PartyAccountType) (id int, err error) {
	acc := domain.NewPartyAccount(globalReferenceId, domain.PartyAccountStatusInactive, accountType)
	err = u.repo.Create(ctx, acc)
	if err != nil {
		pgErr, ok := err.(*pq.Error)
		if ok {
			if pgErr.Code == "23505" {
				return -1, fmt.Errorf("Account %s already exists", globalReferenceId)
			}
		}
		return -1, err
	}
	accRead, err := u.repo.FindAccountByGlobalReferenceID(ctx, globalReferenceId)
	if err != nil {
		return -1, err
	}
	return accRead.Id, nil
}

func (u *financialAccountUseCase) FindMerchantAccount(ctx context.Context, globalReferenceId string) (res *domain.PartyAccount, err error) {
	acc, err := u.repo.FindMerchantByGlobalReferenceID(ctx, globalReferenceId)
	if err != nil {
		return nil, err
	}
	return acc, nil
}

func (u *financialAccountUseCase) FindConsumerAccount(ctx context.Context, globalReferenceId string) (res *domain.PartyAccount, err error) {
	acc, err := u.repo.FindConsumerByGlobalReferenceID(ctx, globalReferenceId)
	if err != nil {
		return nil, err
	}
	return acc, nil
}

func (u *financialAccountUseCase) ActivateFinancialAccount(ctx context.Context, globalReferenceId string) (err error) {
	err = u.repo.UpdateStatus(ctx, globalReferenceId, domain.PartyAccountStatusActive)
	if err != nil {
		return err
	}
	return nil
}

func (u *financialAccountUseCase) DeactivateFinancialAccount(ctx context.Context, globalReferenceId string) (err error) {
	err = u.repo.UpdateStatus(ctx, globalReferenceId, domain.PartyAccountStatusInactive)
	if err != nil {
		return err
	}
	return nil
}
