package types

import "github.com/btechlabs/lms/pkg/cqrs"

type CmdProcessorResult struct {
	AggregateId      string
	AggregateVersion cqrs.Version
	AggregateType    cqrs.AggregateType
}
