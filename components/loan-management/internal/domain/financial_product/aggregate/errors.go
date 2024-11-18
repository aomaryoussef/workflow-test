package aggregate

import (
	"fmt"
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	"github.com/btechlabs/lms/pkg/cqrs"
)

var (
	ErrFinancialProductStateInvalidStateChange = func(currentState pbevent.FinancialProductState, cmdType cqrs.CommandType) error {
		return fmt.Errorf("invalid state change request from: %s using command: %s", currentState.String(), cmdType.String())
	}
)
