package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/pkg/cqrs"
)

func IsValidStateChange(givenState pbevent.FinancialProductState, cmdType cqrs.CommandType) bool {
	switch givenState {
	case pbevent.FinancialProductState_DRAFT:
		return cmdType == cqrs.CmdTypeFinancialProductUpdate || cmdType == cqrs.CmdTypeFinancialProductApprove || cmdType == cqrs.CmdTypeFinancialProductDelete
	case pbevent.FinancialProductState_APPROVED:
		return cmdType == cqrs.CmdTypeFinancialProductPublish || cmdType == cqrs.CmdTypeFinancialProductDelete
	case pbevent.FinancialProductState_PUBLISHED:
		return cmdType == cqrs.CmdTypeFinancialProductUnpublish
	case pbevent.FinancialProductState_UNPUBLISHED:
		return cmdType == cqrs.CmdTypeFinancialProductPublish || cmdType == cqrs.CmdTypeFinancialProductDelete
	default:
		return false
	}
}
