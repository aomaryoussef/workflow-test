package repository

import (
	"context"
	"log"
	
	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/modules/financialproduct/domain"
)

type InMemRepository struct {
	store []*domain.FinancialProduct
}

func NewInMemRepository(envConfig config.EnvConfig) (repo *InMemRepository, err error) {
	repo = &InMemRepository{
		store: make([]*domain.FinancialProduct, 0),
	}
	
	fpMaps, err := loadAllFinancialProductDefinitions(envConfig.AssetsPath)
	if err != nil {
		return nil, err
	}
	for _, fpMap := range fpMaps {
		fp, err := constructFinancialProductFromMap(fpMap)
		if err != nil {
			return nil, err
		}
		log.Printf("Loaded product with key %s version %s", fp.Key(), fp.Version())
		repo.store = append(repo.store, fp)
	}
	
	// TODO: Combine all financial products into a struct and then run a validation, e.g. no multiple active for key and version
	return repo, nil
}

func (repo *InMemRepository) GetAllActiveFinancialProducts(ctx context.Context) (fps []*domain.FinancialProduct) {
	fps = make([]*domain.FinancialProduct, 0)
	
	for _, fp := range repo.store {
		if fp.IsActive() {
			fps = append(fps, fp)
		}
	}
	
	return
}

func (repo *InMemRepository) GetFinancialProduct(ctx context.Context, key string, version string, includeInactive bool) (fp *domain.FinancialProduct, err error) {
	for _, fp := range repo.store {
		if fp.Key() == key && fp.Version() == version {
			if includeInactive || (!includeInactive && fp.IsActive()) {
				return fp, nil
			}
		}
	}
	
	return nil, ErrActiveFinancialProductNotFound
}
