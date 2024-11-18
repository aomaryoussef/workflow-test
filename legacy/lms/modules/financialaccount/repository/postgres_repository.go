package repository

import (
	"context"
	"time"

	"github.com/btechlabs/lms-lite/modules/financialaccount/domain"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
	"github.com/jmoiron/sqlx"
)

const (
	FindAccountCommand        = `SELECT * FROM public.party_account WHERE global_reference_id = $1`
	FindTypedAccountCommand   = `SELECT * FROM public.party_account WHERE global_reference_id = $1 AND account_type = $2`
	InsertPartyAccountCommand = `INSERT INTO public.party_account(global_reference_id, account_type, account_status, created_at, updated_at) VALUES (:global_reference_id, :account_type, :account_status, :created_at, :updated_at)`
	UpdatePartyAccountCommand = `UPDATE public.party_account SET account_status = :account_status, updated_at = :updated_at WHERE global_reference_id = :global_reference_id`
)

var _ PartyAccountRepository = (*PartyAccountPostgresRepository)(nil)

type PartyAccountPostgresRepository struct {
	pg libSql.PgConnectionManager
}

func NewPartyAccountPostgresRepository(pg libSql.PgConnectionManager) *PartyAccountPostgresRepository {
	return &PartyAccountPostgresRepository{
		pg: pg,
	}
}

func (r *PartyAccountPostgresRepository) UpdateStatus(ctx context.Context, globalReferenceId string, status domain.PartyAccountStatus) error {
	args := map[string]interface{}{
		"global_reference_id": globalReferenceId,
		"account_status":      status,
		"updated_at":          time.Now(),
	}
	tx := r.pg.ExtractTx(ctx)
	_, err := tx.NamedExec(UpdatePartyAccountCommand, args)
	if err != nil {
		return err
	}
	return nil
}

func (r *PartyAccountPostgresRepository) Create(ctx context.Context, partyAccount *domain.PartyAccount) (err error) {
	args := map[string]interface{}{
		"id":                  partyAccount.Id,
		"global_reference_id": partyAccount.GlobalReferenceId,
		"account_type":        partyAccount.Type,
		"account_status":      partyAccount.Status,
		"created_at":          partyAccount.CreatedAt,
		"updated_at":          partyAccount.UpdatedAt,
	}
	tx := r.pg.ExtractTx(ctx)
	_, err = tx.NamedExec(InsertPartyAccountCommand, args)
	if err != nil {
		return err
	}
	return nil
}

func (r *PartyAccountPostgresRepository) FindAccountByGlobalReferenceID(ctx context.Context, id string) (partyAccount *domain.PartyAccount, err error) {
	tx := r.pg.ExtractTx(ctx)
	var result struct {
		Id                int       `db:"id"`
		GlobalReferenceId string    `db:"global_reference_id"`
		Type              string    `db:"account_type"`
		Status            string    `db:"account_status"`
		CreatedAt         time.Time `db:"created_at"`
		UpdatedAt         time.Time `db:"updated_at"`
	}
	err = tx.Get(&result, FindAccountCommand, id)
	if err != nil {
		return nil, err
	}
	return &domain.PartyAccount{
		Id:                result.Id,
		GlobalReferenceId: result.GlobalReferenceId,
		Type:              domain.PartyAccountType(result.Type),
		Status:            domain.PartyAccountStatus(result.Status),
		CreatedAt:         result.CreatedAt,
		UpdatedAt:         result.UpdatedAt,
	}, nil
}

func (r *PartyAccountPostgresRepository) FindMerchantByGlobalReferenceID(ctx context.Context, id string) (partyAccount *domain.PartyAccount, err error) {
	return findAccountByGlobalReferenceIAndType(r.pg.ExtractTx(ctx), id, domain.PartyAccountTypeMerchant)
}

func (r *PartyAccountPostgresRepository) FindConsumerByGlobalReferenceID(ctx context.Context, id string) (partyAccount *domain.PartyAccount, err error) {
	return findAccountByGlobalReferenceIAndType(r.pg.ExtractTx(ctx), id, domain.PartyAccountTypeIndividual)
}

func findAccountByGlobalReferenceIAndType(tx *sqlx.Tx, id string, accountType domain.PartyAccountType) (partyAccount *domain.PartyAccount, err error) {
	var result struct {
		Id                int       `db:"id"`
		GlobalReferenceId string    `db:"global_reference_id"`
		Type              string    `db:"account_type"`
		Status            string    `db:"account_status"`
		CreatedAt         time.Time `db:"created_at"`
		UpdatedAt         time.Time `db:"updated_at"`
	}
	err = tx.Get(&result, FindTypedAccountCommand, id, accountType)
	if err != nil {
		return nil, err
	}
	return &domain.PartyAccount{
		Id:                result.Id,
		GlobalReferenceId: result.GlobalReferenceId,
		Type:              domain.PartyAccountType(result.Type),
		Status:            domain.PartyAccountStatus(result.Status),
		CreatedAt:         result.CreatedAt,
		UpdatedAt:         result.UpdatedAt,
	}, nil
}
