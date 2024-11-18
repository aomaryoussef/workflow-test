package job

import (
	"context"
	"fmt"
	"time"

	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	loanaccount "github.com/btechlabs/lms/internal/domain/loan_account/aggregate"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	. "github.com/samber/lo"
)

var _ job.JobArgsWithHeader = (*CreateLoanAccount)(nil)

type CreateLoanAccount struct {
	Header   job.MessageHeader `json:"header"`
	EventId  string            `json:"event_id"`
	BookedAt time.Time         `json:"booked_at"`
	LoanId   string            `json:"loan_id"`
	Version  cqrs.Version      `json:"version"`
}

func (a CreateLoanAccount) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a CreateLoanAccount) Kind() string {
	return types.JobTypeCreateLoanAccount.String()
}

func (h *LoanAccountJobHandler) CreateLoanAccount(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(CreateLoanAccount)

	tx, err := h.db.CreateTransaction(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	la, err := loadLoanAccount(ctx, h.es, tx, request.LoanId, request.EventId)
	if err != nil {
		return err
	}

	wm := storage.LoanAccountWriteModel{
		WriteModel: cqrs.WriteModel{
			Id:               la.Id,
			UpdatedByEventID: la.Events()[len(la.Events())-1].Id,
			UpdatedBy:        la.LastUpdatedBy,
			UpdatedAt:        la.LastUpdatedAtUTC.ToStdLibTime(),
			Version:          la.AggregateVersion.Primitive(),
		},
		CreatedAt:                     la.CreatedAtUTC.ToStdLibTime(),
		CreatedBy:                     la.CreatedBy,
		State:                         la.State().String(),
		SubState:                      la.SubState().String(),
		BorrowerId:                    la.BorrowerId,
		BorrowerRepaymentDayOfMonth:   la.BorrowerRepaymentDayOfMonth,
		CommercialOfferId:             la.CommercialOfferId,
		FinancialProductId:            la.FinancialProductId,
		FinancialProductTenorKey:      la.FinancialProductTenorKey,
		TenorDays:                     la.TenorDays,
		GracePeriodInDays:             la.GracePeriodInDays,
		BookedAt:                      la.BookedAt.ToStdLibTime(),
		MerchantId:                    la.MerchantId,
		LenderSource:                  la.LenderSource,
		OriginationChannel:            la.OriginationChannel,
		AppliedCurrency:               la.MonetaryLineItems.FinancedAmount().Currency().Code,
		FlatRateBasisPoints:           la.FlatRateBasisPoints.Primitive(),
		MonthlyEffectiveRate:          la.MonthlyEffectiveRate,
		TotalEffectiveRate:            la.TotalEffectiveRate,
		AnnualPercentageRate:          la.AnnualPercentageRate,
		VatPercentageBasisPoints:      la.VatPercentageBasisPoints.Primitive(),
		AdminFeePercentageBasisPoints: la.AdminFeePercentageBasisPoints.Primitive(),
		EarlySettlementFeeBasisPoints: la.EarlySettlementFeeBasisPoints.Primitive(),
		BadDebtFeeBasisPoints:         la.BadDebtFeeBasisPoints.Primitive(),
		RoundingUpEstimatedGainUnits:  la.RoundingUpEstimatedGain.Amount(),
		MonetaryLineItems: Map(la.MonetaryLineItems, func(item loanaccount.LoanAccountMonetaryLineItem, _ int) storage.LoanAccountMonetaryLineItemWriteModel {
			return storage.LoanAccountMonetaryLineItemWriteModel{
				AmountUnits:    item.Amount.Amount(),
				Type:           item.Type.String(),
				CollectionType: item.CollectionType.String(),
			}
		}),
	}
	err = storage.InsertNewLoanAccount(ctx, tx, wm)
	if err != nil {
		return err
	}

	log.Debug(fmt.Sprintf("inserted new loan account with id: %s marked by event: %s", la.Id, la.Events()[len(la.Events())-1].Id))

	return nil
}
