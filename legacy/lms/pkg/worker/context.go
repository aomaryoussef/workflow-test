package worker

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/logging"
	
	"github.com/conductor-sdk/conductor-go/sdk/model"
)

// contextFromTask creates a context from an incoming task
func contextFromTask(t *model.Task) context.Context {
	ctx := context.Background()
	
	ctx = context.WithValue(ctx, logging.WorkflowIdContextKey, t.WorkflowInstanceId)
	ctx = context.WithValue(ctx, logging.WorkflowNameContextKey, t.WorkflowType)
	ctx = context.WithValue(ctx, logging.TaskIdContextKey, t.TaskId)
	ctx = context.WithValue(ctx, logging.TaskNameContextKey, t.TaskDefinition.Name)
	ctx = context.WithValue(ctx, logging.WorkflowWorkerIdContextKey, t.WorkerId)
	ctx = context.WithValue(ctx, logging.RequestIdContextKey, t.WorkflowInstanceId)
	
	userId := t.InputData["user_id"]
	if userId == nil {
		userId = fmt.Sprintf("wf:%s", t.WorkflowInstanceId)
	}
	ctx = context.WithValue(ctx, logging.UserIdContextKey, userId)
	
	if t.CorrelationId == "" {
		t.CorrelationId = t.WorkflowInstanceId
	}
	ctx = context.WithValue(ctx, logging.CorrelationIdContextKey, t.CorrelationId)
	
	return ctx
}
