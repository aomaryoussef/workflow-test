package aggregate

import (
	pbevent "github.com/btechlabs/lms/gen/pb/event"
	cmdpkg "github.com/btechlabs/lms/pkg/cqrs"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestIsValidStateChange(t *testing.T) {

	type testcase struct {
		name               string
		givenState         pbevent.FinancialProductState
		appliedCommand     cmdpkg.CommandType
		stateChangeAllowed bool
	}
	testcases := []testcase{
		{
			name:               "given draft state, create is not possible",
			givenState:         pbevent.FinancialProductState_DRAFT,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductCreate,
			stateChangeAllowed: false,
		},
		{
			name:               "given draft state, update is possible",
			givenState:         pbevent.FinancialProductState_DRAFT,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUpdate,
			stateChangeAllowed: true,
		},
		{
			name:               "given draft state, delete is possible",
			givenState:         pbevent.FinancialProductState_DRAFT,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductDelete,
			stateChangeAllowed: true,
		},
		{
			name:               "given draft state, publish is not possible",
			givenState:         pbevent.FinancialProductState_DRAFT,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductPublish,
			stateChangeAllowed: false,
		},
		{
			name:               "given draft state, unpublish is not possible",
			givenState:         pbevent.FinancialProductState_DRAFT,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUnpublish,
			stateChangeAllowed: false,
		},
		{
			name:               "given publish state, create is not possible",
			givenState:         pbevent.FinancialProductState_PUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductCreate,
			stateChangeAllowed: false,
		},
		{
			name:               "given publish state, update is not possible",
			givenState:         pbevent.FinancialProductState_PUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUpdate,
			stateChangeAllowed: false,
		},
		{
			name:               "given publish state, publish again is not possible",
			givenState:         pbevent.FinancialProductState_PUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductPublish,
			stateChangeAllowed: false,
		},
		{
			name:               "given publish state, unpublish is possible",
			givenState:         pbevent.FinancialProductState_PUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUnpublish,
			stateChangeAllowed: true,
		},
		{
			name:               "given publish state, delete is not possible",
			givenState:         pbevent.FinancialProductState_PUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductDelete,
			stateChangeAllowed: false,
		},
		{
			name:               "given unpublish state, create is not possible",
			givenState:         pbevent.FinancialProductState_UNPUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductCreate,
			stateChangeAllowed: false,
		},
		{
			name:               "given unpublish state, update is not possible",
			givenState:         pbevent.FinancialProductState_UNPUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUpdate,
			stateChangeAllowed: false,
		},
		{
			name:               "given unpublish state, unpublish again is not possible",
			givenState:         pbevent.FinancialProductState_UNPUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUnpublish,
			stateChangeAllowed: false,
		},
		{
			name:               "given unpublish state, delete is possible",
			givenState:         pbevent.FinancialProductState_UNPUBLISHED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductDelete,
			stateChangeAllowed: true,
		},
		{
			name:               "given delete state, create is not possible",
			givenState:         pbevent.FinancialProductState_DELETED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductCreate,
			stateChangeAllowed: false,
		},
		{
			name:               "given delete state, update is not possible",
			givenState:         pbevent.FinancialProductState_DELETED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductUpdate,
			stateChangeAllowed: false,
		},
		{
			name:               "given delete state, delete again is not possible",
			givenState:         pbevent.FinancialProductState_DELETED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductDelete,
			stateChangeAllowed: false,
		},
		{
			name:               "given delete state, publish is not possible",
			givenState:         pbevent.FinancialProductState_DELETED,
			appliedCommand:     cmdpkg.CmdTypeFinancialProductPublish,
			stateChangeAllowed: false,
		},
	}

	for _, tc := range testcases {
		t.Run(tc.name, func(t *testing.T) {
			stateChangePossible := IsValidStateChange(tc.givenState, tc.appliedCommand)
			assert.Equal(t, tc.stateChangeAllowed, stateChangePossible)
		})
	}
}
