package contextx

import (
	"context"
	"net/http"
)

type ContextKey string

func (c ContextKey) String() string {
	return string(c)
}

const (
	ContextKeyRequestId            ContextKey = "request_id"        // RequestId is the unique identifier for a request
	ContextKeyUserId               ContextKey = "user_id"           // UserId is the unique identifier for the user making the call
	ContextKeyCallingSystemId      ContextKey = "calling_system_id" // CallingSystemId is the unique identifier for the system making the call on behalf of the user
	ContextKeyCurrentAction        ContextKey = "action_ctx"        // CurrentActionContext is the current action name (if any) in the context
	ContextKeyBackgroundJobId      ContextKey = "job_id"            // BackgroundJobId is the unique identifier for the background worker (if any) in the context
	ContextKeyBackgroundJobAttempt ContextKey = "job_attempt"
	ContextKeyEventId              ContextKey = "event_id" // EventId is the unique identifier for the eventsourcing (if any) in the context (used in workers)
	ContextKeySpanId               ContextKey = "span_id"  // SpanId is the unique identifier for the span (if any) in the context
	ContextKeyTraceId              ContextKey = "trace_id" // TraceId is the unique identifier for the trace (if any) in the context
)

var SystemContextKeys = []ContextKey{
	ContextKeyRequestId,
	ContextKeyUserId,
	ContextKeyCallingSystemId,
	ContextKeyCurrentAction,
	ContextKeyBackgroundJobId,
	ContextKeyBackgroundJobAttempt,
	ContextKeyEventId,
	ContextKeySpanId,
	ContextKeyTraceId,
}

// ContextFromHttpRequest extracts the context from the incoming httpx request
func ContextFromHttpRequest(req *http.Request) context.Context {
	ctx := req.Context()
	for _, key := range SystemContextKeys {
		if val := req.Header.Get(string(key)); val != "" {
			ctx = context.WithValue(ctx, key, val)
		}
	}
	return ctx
}
