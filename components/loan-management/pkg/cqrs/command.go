package cqrs

import (
	"context"
	"errors"
	"github.com/btechlabs/lms/pkg/contextx"
	"github.com/btechlabs/lms/pkg/timex"
	"time"
)

var (
	/* Job Type Errors */

	ErrJobTypeNotImplemented = errors.New("worker type not implemented")

	/* Command Errors */

	ErrCommandTypeNotImplemented      = errors.New("command type not implemented")
	ErrUnknownCommandType             = errors.New("unknown commands type")
	ErrInvalidCommand                 = errors.New("invalid commands")
	ErrCommandValidationFailed        = errors.New("commands validation failed")
	ErrCommandLinkedAggregateExists   = errors.New("commands linked aggregate already exists")
	ErrCommandLinkedAggregateNotFound = errors.New("commands linked aggregate not found")
	ErrCommandVersionConflict         = errors.New("commands version conflict")
)

// Command is the intend to store an eventsourcing into the event_store
type Command interface {
	// Type returns the type of the commands
	Type() CommandType
	// CommandMetadata returns the CmdMetadata of the commands
	CommandMetadata() CommandMetadata
	// Validate validates the command
	Validate() error
}

type CommandMetadata struct {
	CreatedBy       string
	CreatedAtUTC    time.Time
	TraceId         string
	CallingSystemId string
}

// NewCommandMetadataFromContext creates a new CommandMetadata from the given context.
// The commandCreationTimeUTC is the time the commands was created at in UTC format and
// must not be taken from the context itself due to the nature of disjoint context in
// case of retries.
func newCommandMetadataFromContext(ctx context.Context, commandCreationTimeUTC timex.UtcTime) CommandMetadata {
	cm := CommandMetadata{}
	u, ok := ctx.Value(contextx.ContextKeyUserId).(string)
	if ok {
		cm.CreatedBy = u
	} else {
		panic("command_metadata: user_id not found in context")
	}
	t, ok := ctx.Value(contextx.ContextKeyRequestId).(string)
	if ok {
		cm.TraceId = t
	} else {
		panic("command_metadata: trace_id not found in context")
	}
	c, ok := ctx.Value(contextx.ContextKeyCallingSystemId).(string)
	if ok {
		cm.CallingSystemId = c
	} else {
		panic("command_metadata: calling_system_id not found in context")
	}
	cm.CreatedAtUTC = commandCreationTimeUTC.ToStdLibTime()
	return cm
}

// GetCommandBookedBy returns the CreatedBy field.
func (c CommandMetadata) GetCommandBookedBy() string {
	return c.CreatedBy
}

// GetCommandBookedAt returns the CreatedAt field.
func (c CommandMetadata) GetCommandBookedAt() timex.UtcTime {
	return timex.NewUtcTime(c.CreatedAtUTC)
}

// GetTraceId returns the TraceId field.
func (c CommandMetadata) GetTraceId() string {
	return c.TraceId
}

// GetCallingSystemId returns the CallingSystemId field.
func (c CommandMetadata) GetCallingSystemId() string {
	return c.CallingSystemId
}

type BaseCommand struct {
	CmdType     CommandType
	CmdMetadata CommandMetadata
}

func NewBaseCommand(ctx context.Context, commandType CommandType, bookingTime timex.UtcTime) BaseCommand {
	return BaseCommand{
		CmdType:     commandType,
		CmdMetadata: newCommandMetadataFromContext(ctx, bookingTime),
	}
}

func (c BaseCommand) Type() CommandType {
	return c.CmdType
}

func (c BaseCommand) CommandMetadata() CommandMetadata {
	return c.CmdMetadata
}
