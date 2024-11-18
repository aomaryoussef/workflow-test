package aggregate

import (
	"fmt"

	pbcommon "github.com/btechlabs/lms/gen/pb/common"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/cqrs"
	"github.com/btechlabs/lms/pkg/money"
	"github.com/btechlabs/lms/pkg/timex"
	. "github.com/samber/lo"
)

func (fp *FinancialProductAggregate) Reduce() error {
	for _, evnt := range fp.BaseAggregate.Events() {
		switch evnt.EventType {
		case pbcommon.EventType_FINANCIAL_PRODUCT_CREATED:
			if err := fp.onCreated(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_FINANCIAL_PRODUCT_UPDATED:
			if err := fp.onUpdated(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_FINANCIAL_PRODUCT_APPROVED:
			if err := fp.onApproved(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_FINANCIAL_PRODUCT_PUBLISHED:
			if err := fp.onPublished(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_FINANCIAL_PRODUCT_UNPUBLISHED:
			if err := fp.onUnpublished(evnt); err != nil {
				return err
			}
		case pbcommon.EventType_FINANCIAL_PRODUCT_DELETED:
			if err := fp.onDeleted(evnt); err != nil {
				return err
			}
		default:
			return fmt.Errorf("eventsource type not supported for financial product reduce function: %s", evnt.EventType.String())
		}
	}

	fp.BaseAggregate.BaseAggregateReduce()
	return nil
}

func (fp *FinancialProductAggregate) onCreated(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductCreatedEventPayload)

	fp.state = payload.GetState()
	fp.Name = payload.GetName()
	fp.Description = payload.GetDescription()
	fp.ActiveSince = timex.NewUtcTime(payload.GetActiveSince().AsTime())
	fp.ActiveUntil = timex.NewUtcTime(payload.GetActiveUntil().AsTime())
	fp.vatPercentBasisPoints = types.PercentBasisPoints(payload.GetVatPercentBasisPoints())
	fp.AdminFeeBasisPoints = types.PercentBasisPoints(NewDefaultAdminFeeFromString(payload.GetAdminFee().Value).Value)
	fp.EarlySettlementFeeBasisPoints = types.PercentBasisPoints(payload.GetEarlySettlementFeeBasisPoints())
	fp.BadDebtProvisionBasisPoints = types.PercentBasisPoints(payload.GetBadDebtAllowanceBasisPoints())
	fp.InstallmentRoundingType = RoundingTypeUp
	fp.GracePeriodInDays = payload.GetFinancialProductConfig().GetGracePeriodInDays()
	fp.PrincipalRange = PrincipalRange{
		Min: *money.MapProtoMoneyToDomainMoney(payload.GetFinancialProductConfig().GetMinimumPrincipal()),
		Max: *money.MapProtoMoneyToDomainMoney(payload.GetFinancialProductConfig().GetMaximumPrincipal()),
	}
	fp.DownPayment = DownPayment{
		Min: types.PercentBasisPoints(payload.GetFinancialProductConfig().GetMinDownPaymentBasisPoints()),
		Max: types.PercentBasisPoints(payload.GetFinancialProductConfig().GetMaxDownPaymentBasisPoints()),
	}
	fp.Tenors = Map(payload.GetTenors(), func(item *pbevent.FinancialProductTenor, _ int) FinancialProductTenor {
		return FinancialProductTenor{
			Key:                 item.GetKey(),
			DurationInDays:      item.GetDurationInDays(),
			Interest:            types.PercentBasisPoints(item.InterestBasisPoints),
			AdminFeeBasisPoints: types.PercentBasisPoints(NewDefaultAdminFeeFromString(item.GetAdminFee().Value).Value),
		}
	})
	return nil
}

func (fp *FinancialProductAggregate) onUpdated(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductUpdatedEventPayload)

	fp.Name = payload.GetName()
	fp.Description = payload.GetDescription()
	fp.ActiveSince = timex.NewUtcTime(payload.GetActiveSince().AsTime())
	fp.ActiveUntil = timex.NewUtcTime(payload.GetActiveUntil().AsTime())
	fp.vatPercentBasisPoints = types.PercentBasisPoints(payload.GetVatPercentBasisPoints())
	fp.AdminFeeBasisPoints = types.PercentBasisPoints(NewDefaultAdminFeeFromString(payload.GetAdminFee().Value).Value)
	fp.EarlySettlementFeeBasisPoints = types.PercentBasisPoints(payload.GetEarlySettlementFeeBasisPoints())
	fp.BadDebtProvisionBasisPoints = types.PercentBasisPoints(payload.GetBadDebtAllowanceBasisPoints())
	fp.InstallmentRoundingType = RoundingTypeUp
	fp.GracePeriodInDays = payload.GetFinancialProductConfig().GetGracePeriodInDays()
	fp.PrincipalRange = PrincipalRange{
		Min: *money.MapProtoMoneyToDomainMoney(payload.GetFinancialProductConfig().GetMinimumPrincipal()),
		Max: *money.MapProtoMoneyToDomainMoney(payload.GetFinancialProductConfig().GetMaximumPrincipal()),
	}
	fp.DownPayment = DownPayment{
		Min: types.PercentBasisPoints(payload.GetFinancialProductConfig().GetMinDownPaymentBasisPoints()),
		Max: types.PercentBasisPoints(payload.GetFinancialProductConfig().GetMaxDownPaymentBasisPoints()),
	}
	fp.Tenors = Map(payload.GetTenors(), func(item *pbevent.FinancialProductTenor, _ int) FinancialProductTenor {
		return FinancialProductTenor{
			Key:                 item.GetKey(),
			DurationInDays:      item.GetDurationInDays(),
			Interest:            types.PercentBasisPoints(item.InterestBasisPoints),
			AdminFeeBasisPoints: types.PercentBasisPoints(NewDefaultAdminFeeFromString(item.GetAdminFee().Value).Value),
		}
	})
	return nil
}

func (fp *FinancialProductAggregate) onApproved(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductApprovedEventPayload)

	fp.state = payload.GetState()
	return nil
}

func (fp *FinancialProductAggregate) onPublished(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductPublishedEventPayload)

	fp.state = payload.GetState()
	return nil
}

func (fp *FinancialProductAggregate) onUnpublished(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductUnpublishedEventPayload)

	fp.state = payload.GetState()
	return nil
}

func (fp *FinancialProductAggregate) onDeleted(e cqrs.Event) error {
	payload := e.Payload.(*pbevent.FinancialProductDeletedEventPayload)

	fp.state = payload.GetState()
	return nil
}
