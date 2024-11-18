package job

import (
	"context"
	"errors"
	"fmt"

	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/financial_product/aggregate"
	"github.com/btechlabs/lms/internal/domain/financial_product/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	. "github.com/samber/lo"
)

var _ job.JobArgsWithHeader = (*WriteFinancialProduct)(nil)

type WriteFinancialProduct struct {
	Header             job.MessageHeader `json:"header"`
	EventId            string            `json:"event_id"`
	FinancialProductId string            `json:"financial_product_id"`
	Version            uint64            `json:"version"`
}

func (w WriteFinancialProduct) Kind() string {
	return types.JobTypeWriteFinancialProduct.String()
}

func (w WriteFinancialProduct) MessageHeader() job.MessageHeader {
	return w.Header
}

func (h *FinancialProductJobHandler) UpsertFinancialProduct(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(WriteFinancialProduct)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	log.Debug(fmt.Sprintf("loading events for financial product aggregate with id: %s and version: %d", request.FinancialProductId, request.Version))

	fp, err := loadFinancialProduct(ctx, h.es, tx, request.FinancialProductId, request.EventId)
	if err != nil {
		return err
	}

	lastReducedEvent := fp.Events()[len(fp.Events())-1]

	switch lastReducedEvent.EventType {
	case pbcommon.EventType_FINANCIAL_PRODUCT_CREATED:
		err = storage.InsertNewFinancialProduct(ctx, tx, mapFinancialProductToDtoModel(fp, request.EventId))
		if err != nil {
			return err
		}
	case pbcommon.EventType_FINANCIAL_PRODUCT_UPDATED:
		err := storage.UpdateExistingFinancialProduct(ctx, tx, mapFinancialProductToDtoModel(fp, request.EventId))
		if err != nil {
			if errors.Is(err, sql_driver.ErrVersionMismatchOptimisticLocking) {
				log.Warn(
					fmt.Sprintf("optimistic locking failed for financial product update aggregate with id: %s and new version: %d, retrying job",
						fp.Id,
						fp.AggregateVersion.Primitive(),
					),
				)
			}
			return err
		}
	default:
		log.Warn(fmt.Sprintf("unsupported event type: %s", lastReducedEvent.EventType))
	}

	if err != nil {
		return err
	}

	return nil
}

func mapFinancialProductToDtoModel(financialProduct *aggregate.FinancialProductAggregate, lastEventId string) storage.FinancialProductWriteModel {
	return storage.FinancialProductWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               financialProduct.Id,
			Version:          financialProduct.AggregateVersion.Primitive(),
			UpdatedAt:        financialProduct.LastUpdatedAtUTC.ToStdLibTime(),
			UpdatedBy:        financialProduct.LastUpdatedBy,
			UpdatedByEventID: lastEventId,
		},
		CreatedAt:                            financialProduct.CreatedAtUTC.ToStdLibTime(),
		CreatedBy:                            financialProduct.CreatedBy,
		State:                                financialProduct.State().String(),
		Name:                                 financialProduct.Name,
		Description:                          financialProduct.Description,
		ActiveSince:                          financialProduct.ActiveSince.ToStdLibTime(),
		ActiveUntil:                          financialProduct.ActiveUntil.ToStdLibTime(),
		GracePeriodInDays:                    int(financialProduct.GracePeriodInDays),
		MinPrincipalCurrency:                 financialProduct.PrincipalRange.Min.Currency().Code,
		MinPrincipalUnits:                    int(financialProduct.PrincipalRange.Min.Amount()),
		MaxPrincipalCurrency:                 financialProduct.PrincipalRange.Max.Currency().Code,
		MaxPrincipalUnits:                    int(financialProduct.PrincipalRange.Max.Amount()),
		MinDownPaymentBasisPoints:            int(financialProduct.DownPayment.Min.Primitive()),
		MaxDownPaymentBasisPoints:            int(financialProduct.DownPayment.Max.Primitive()),
		VatPercentBasisPoints:                int(financialProduct.VatPercentBasisPoints().Primitive()),
		AdminFeePercentBasisPoints:           int(financialProduct.AdminFeeBasisPoints.Primitive()),
		EarlySettlementFeePercentBasisPoints: int(financialProduct.EarlySettlementFeeBasisPoints.Primitive()),
		BadDebtProvisionPercentBasisPoints:   int(financialProduct.BadDebtProvisionBasisPoints.Primitive()),
		Tenors: Map(financialProduct.Tenors, func(t aggregate.FinancialProductTenor, _ int) storage.FinancialProductTenor {
			return storage.FinancialProductTenor{
				TenorKey:                   t.Key,
				DurationInDays:             int(t.DurationInDays),
				InterestPercentBasisPoints: int(t.Interest),
				AdminFeePercentBasisPoints: int(t.AdminFeeBasisPoints.Primitive()),
			}
		}),
	}
}
