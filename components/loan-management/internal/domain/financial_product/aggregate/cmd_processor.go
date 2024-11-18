package aggregate

import (
	"fmt"
	"strconv"

	"github.com/btechlabs/lms/gen/api"
	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	. "github.com/samber/lo"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func (fp *FinancialProductAggregate) ApplyCommand(cmd cqrs.Command) (*cqrs.Event, error) {
	if cmd == nil {
		return nil, cqrs.ErrInvalidCommand
	}
	fp.BaseAggregate.BaseAggregateApplyCommand(cmd)

	switch cmd.Type() {
	case cqrs.CmdTypeFinancialProductCreate:
		return fp.onCmdCreate(*cmd.(*types.CreateFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductUpdate:
		return fp.onCmdUpdate(*cmd.(*types.UpdateFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductApprove:
		return fp.onCmdApprove(*cmd.(*types.ApproveFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductPublish:
		return fp.onCmdPublish(*cmd.(*types.PublishFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductUnpublish:
		return fp.onCmdUnpublish(*cmd.(*types.UnpublishFinancialProductCmd))
	case cqrs.CmdTypeFinancialProductDelete:
		return fp.onCmdDelete(*cmd.(*types.DeleteFinancialProductCmd))
	default:
		return nil, cqrs.ErrUnknownCommandType
	}
}

func (fp *FinancialProductAggregate) onCmdCreate(cmd types.CreateFinancialProductCmd) (*cqrs.Event, error) {
	payload := pbevent.FinancialProductCreatedEventPayload{
		Key:         cmd.Key,
		State:       pbevent.FinancialProductState_DRAFT,
		Name:        cmd.Name,
		Description: cmd.Description,
		FinancialProductConfig: &pbevent.FinancialProductConfig{
			InstallmentRoundingType:   RoundingTypeUp.String(),
			MaximumPrincipal:          money.MapApiMoneyToProtoMoney(cmd.MaxPrincipal),
			MinimumPrincipal:          money.MapApiMoneyToProtoMoney(cmd.MinPrincipal),
			MinDownPaymentBasisPoints: uint32(cmd.MinDownPaymentBasisPoints),
			MaxDownPaymentBasisPoints: uint32(cmd.MaxDownPaymentBasisPoints),
			GracePeriodInDays:         uint32(cmd.GracePeriodDays),
		},
		ActiveSince:           timestamppb.New(cmd.ActiveSinceUtc),
		ActiveUntil:           timestamppb.New(cmd.ActiveUntilUtc),
		VatPercentBasisPoints: fp.VatPercentBasisPoints().Primitive(),
		AdminFee: &pbevent.FinancialProductAdminFee{
			CalculationType: CalculationTypeFixedPercent.String(),
			Value:           strconv.Itoa(cmd.AdminFeeBasisPoints),
		},
		EarlySettlementFeeBasisPoints: uint32(cmd.EarlySettlementFeeBasisPoints),
		BadDebtAllowanceBasisPoints:   uint32(cmd.BadDebtAllowanceBasisPoints),
		Tenors: Map(cmd.Tenors, func(tenor api.FinancialProductTenor, _ int) *pbevent.FinancialProductTenor {
			return &pbevent.FinancialProductTenor{
				Key:                 tenor.Key,
				DurationInDays:      uint32(tenor.DurationInDays),
				InterestBasisPoints: uint32(tenor.InterestRateBasisPoints),
				AdminFee: &pbevent.FinancialProductAdminFee{
					CalculationType: CalculationTypeFixedPercent.String(),
					Value:           strconv.Itoa(tenor.AdminFeeBasisPoints),
				},
			}
		}),
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_CREATED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		cqrs.Version(1),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}

func (fp *FinancialProductAggregate) onCmdUpdate(cmd types.UpdateFinancialProductCmd) (*cqrs.Event, error) {
	// validations
	if IsValidStateChange(fp.state, cmd.Type()) == false {
		return nil, ErrFinancialProductStateInvalidStateChange(fp.state, cmd.CmdType)
	}

	payload := pbevent.FinancialProductUpdatedEventPayload{
		Name:        cmd.Name,
		Description: cmd.Description,
		FinancialProductConfig: &pbevent.FinancialProductConfig{
			InstallmentRoundingType:   RoundingTypeUp.String(),
			MaximumPrincipal:          money.MapApiMoneyToProtoMoney(cmd.MaxPrincipal),
			MinimumPrincipal:          money.MapApiMoneyToProtoMoney(cmd.MinPrincipal),
			MinDownPaymentBasisPoints: uint32(cmd.MinDownPaymentBasisPoints),
			MaxDownPaymentBasisPoints: uint32(cmd.MaxDownPaymentBasisPoints),
			GracePeriodInDays:         uint32(cmd.GracePeriodDays),
		},
		ActiveSince:           timestamppb.New(cmd.ActiveSinceUtc),
		ActiveUntil:           timestamppb.New(cmd.ActiveUntilUtc),
		VatPercentBasisPoints: fp.VatPercentBasisPoints().Primitive(),
		AdminFee: &pbevent.FinancialProductAdminFee{
			CalculationType: CalculationTypeFixedPercent.String(),
			Value:           strconv.Itoa(cmd.AdminFeeBasisPoints),
		},
		EarlySettlementFeeBasisPoints: uint32(cmd.EarlySettlementFeeBasisPoints),
		BadDebtAllowanceBasisPoints:   uint32(cmd.BadDebtAllowanceBasisPoints),
		Tenors: Map(cmd.Tenors, func(tenor api.FinancialProductTenor, _ int) *pbevent.FinancialProductTenor {
			return &pbevent.FinancialProductTenor{
				Key:                 tenor.Key,
				DurationInDays:      uint32(tenor.DurationInDays),
				InterestBasisPoints: uint32(tenor.InterestRateBasisPoints),
				AdminFee: &pbevent.FinancialProductAdminFee{
					CalculationType: CalculationTypeFixedPercent.String(),
					Value:           strconv.Itoa(tenor.AdminFeeBasisPoints),
				},
			}
		}),
	}

	cmdMetadata := cmd.CommandMetadata()
	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_UPDATED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		fp.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}

func (fp *FinancialProductAggregate) onCmdApprove(cmd types.ApproveFinancialProductCmd) (*cqrs.Event, error) {
	// validations
	if IsValidStateChange(fp.state, cmd.Type()) == false {
		return nil, ErrFinancialProductStateInvalidStateChange(fp.state, cmd.CmdType)
	}

	cmdMetadata := cmd.CommandMetadata()
	payload := pbevent.FinancialProductApprovedEventPayload{
		Comment: fmt.Sprintf("Financial product approved by %s at time: %s", cmdMetadata.GetCommandBookedBy(), cmdMetadata.GetCommandBookedAt().String()),
		State:   pbevent.FinancialProductState_APPROVED,
	}

	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_APPROVED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		fp.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}

func (fp *FinancialProductAggregate) onCmdPublish(cmd types.PublishFinancialProductCmd) (*cqrs.Event, error) {
	// validations
	if IsValidStateChange(fp.state, cmd.Type()) == false {
		return nil, ErrFinancialProductStateInvalidStateChange(fp.state, cmd.CmdType)
	}

	cmdMetadata := cmd.CommandMetadata()
	payload := pbevent.FinancialProductPublishedEventPayload{
		Comment: fmt.Sprintf("Financial product published by %s at time: %s", cmdMetadata.GetCommandBookedBy(), cmdMetadata.GetCommandBookedAt().String()),
		State:   pbevent.FinancialProductState_PUBLISHED,
	}

	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_PUBLISHED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		fp.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}

func (fp *FinancialProductAggregate) onCmdUnpublish(cmd types.UnpublishFinancialProductCmd) (*cqrs.Event, error) {
	// validations
	if IsValidStateChange(fp.state, cmd.Type()) == false {
		return nil, ErrFinancialProductStateInvalidStateChange(fp.state, cmd.CmdType)
	}

	cmdMetadata := cmd.CommandMetadata()
	payload := pbevent.FinancialProductUnpublishedEventPayload{
		Comment: fmt.Sprintf("Financial product unpublished by %s at time: %s", cmdMetadata.GetCommandBookedBy(), cmdMetadata.GetCommandBookedAt().String()),
		State:   pbevent.FinancialProductState_UNPUBLISHED,
	}

	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_UNPUBLISHED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		fp.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}

func (fp *FinancialProductAggregate) onCmdDelete(cmd types.DeleteFinancialProductCmd) (*cqrs.Event, error) {
	// validations
	if IsValidStateChange(fp.state, cmd.Type()) == false {
		return nil, ErrFinancialProductStateInvalidStateChange(fp.state, cmd.CmdType)
	}

	cmdMetadata := cmd.CommandMetadata()
	payload := pbevent.FinancialProductDeletedEventPayload{
		Comment: fmt.Sprintf("Financial product deleted by %s at time: %s", cmdMetadata.GetCommandBookedBy(), cmdMetadata.GetCommandBookedAt().String()),
		State:   pbevent.FinancialProductState_DELETED,
	}

	event := cqrs.NewEvent(
		pbcommon.EventType_FINANCIAL_PRODUCT_DELETED,
		cmdMetadata.GetCommandBookedAt(),
		cmdMetadata.GetCommandBookedBy(),
		cmd.Key,
		types.AggregateTypeFinancialProduct,
		fp.AggregateVersion.Increment(),
		cmdMetadata.GetCallingSystemId(),
		cmdMetadata.GetTraceId(),
		&payload,
	)
	return event, nil
}
