package logging

import (
	"context"
)

type ContextKey string

const (
	CorrelationIdContextKey    ContextKey = "correlation_id"
	RequestIdContextKey        ContextKey = "request_id"
	UserIdContextKey           ContextKey = "user_id"
	WorkflowIdContextKey       ContextKey = "workflow_id"
	WorkflowNameContextKey     ContextKey = "workflow_name"
	WorkflowWorkerIdContextKey ContextKey = "workflow_worker_id"
	TaskIdContextKey           ContextKey = "task_id"
	TaskNameContextKey         ContextKey = "task_name"
)

var contextKeys = []ContextKey{
	UserIdContextKey,
	RequestIdContextKey,
	CorrelationIdContextKey,
	WorkflowIdContextKey,
	WorkflowNameContextKey,
	WorkflowWorkerIdContextKey,
	TaskIdContextKey,
	TaskNameContextKey,
}

func ExtractUserId(ctx context.Context) string {
	return ctx.Value(UserIdContextKey).(string)
}

func ExtractCorrelationId(ctx context.Context) string {
	return ctx.Value(CorrelationIdContextKey).(string)
}
