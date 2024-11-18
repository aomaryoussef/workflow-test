package job

import (
	"context"
	"errors"
	"fmt"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/financial_product/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"time"
)

var _ job.JobArgsWithHeader = (*UpdateFinancialProductState)(nil)

type UpdateFinancialProductState struct {
	Header             job.MessageHeader `json:"header"`
	EventId            string            `json:"event_id"`
	EventType          string            `json:"event_type"`
	BookedAt           time.Time         `json:"booked_at"`
	UpdatedBy          string            `json:"updated_by"`
	FinancialProductId string            `json:"financial_product_id"`
	Version            uint64            `json:"version"`
	NewState           string            `json:"new_state"`
}

func (u UpdateFinancialProductState) Kind() string {
	return types.JobTypeUpdateFinancialProductState.String()
}

func (u UpdateFinancialProductState) MessageHeader() job.MessageHeader {
	return u.Header
}

func (h *FinancialProductJobHandler) UpdateFinancialProductState(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(UpdateFinancialProductState)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	switch request.EventType {
	case pbcommon.EventType_FINANCIAL_PRODUCT_APPROVED.String(),
		pbcommon.EventType_FINANCIAL_PRODUCT_PUBLISHED.String(),
		pbcommon.EventType_FINANCIAL_PRODUCT_UNPUBLISHED.String(),
		pbcommon.EventType_FINANCIAL_PRODUCT_DELETED.String():
		wm := storage.FinancialProductUpdateStateWriteModel{
			WriteModel: cqrs.WriteModel{
				Id:               request.FinancialProductId,
				UpdatedAt:        request.BookedAt,
				UpdatedBy:        request.UpdatedBy,
				UpdatedByEventID: request.EventId,
				Version:          request.Version,
			},
			State: request.NewState,
		}

		err := storage.UpdateState(ctx, tx, wm)
		if err != nil {
			if errors.Is(err, sql_driver.ErrVersionMismatchOptimisticLocking) {
				log.Warn(
					fmt.Sprintf("optimistic locking failed for financial product state update aggregate with id: %s and new version: %d and new state: %s, retrying job",
						request.FinancialProductId,
						request.Version,
						request.NewState,
					),
				)
			}
			return err
		}
	default:
		log.Warn(fmt.Sprintf("unsupported event type: %s", request.EventType))
	}

	if err != nil {
		return err
	}

	return nil
}
