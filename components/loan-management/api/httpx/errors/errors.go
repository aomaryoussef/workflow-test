package errors

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/pkg/contextx"
)

const (
	InternalServerError = "internal_server_error"
)

func ErrBadGateway(ctx context.Context, w http.ResponseWriter) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.BadGateway{
		Message: "API not available on this server",
		Code:    strconv.Itoa(http.StatusBadGateway),
		TraceId: traceId,
	}, w, http.StatusBadGateway)
}

func ErrEntityNotFound(ctx context.Context, w http.ResponseWriter, err error) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.NotFound{
		Message: err.Error(),
		Code:    strconv.Itoa(http.StatusNotFound),
		TraceId: traceId,
	}, w, http.StatusNotFound)
}

func ErrConflictError(ctx context.Context, w http.ResponseWriter, err error) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.NotFound{
		Message: err.Error(),
		Code:    strconv.Itoa(http.StatusConflict),
		TraceId: traceId,
	}, w, http.StatusConflict)
}

func ErrUnprocessableEntityError(ctx context.Context, w http.ResponseWriter, err error) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.BadRequest{
		Message: err.Error(),
		Code:    strconv.Itoa(http.StatusUnprocessableEntity),
		TraceId: traceId,
	}, w, http.StatusUnprocessableEntity)
}

func ErrInternalServerError(ctx context.Context, w http.ResponseWriter) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.InternalServerError{
		Message: "Something went wrong on the server",
		Code:    strconv.Itoa(http.StatusInternalServerError),
		TraceId: traceId,
	}, w, http.StatusInternalServerError)
}

func ErrMissingMandatoryETag(ctx context.Context, w http.ResponseWriter) {
	traceId := ctx.Value(contextx.ContextKeyRequestId).(string)
	SendErrResponse(api.BadRequest{
		Message: "ETag header missing or malformed",
		Code:    strconv.Itoa(http.StatusBadRequest),
		TraceId: traceId,
	}, w, http.StatusBadRequest)
}

func ErrMissingXUserId(ctx context.Context, w http.ResponseWriter) {
	traceId := ctx.Value(contextx.ContextKeyRequestId)
	if traceId == nil {
		traceId = "not-found"
	}
	SendErrResponse(api.BadRequest{
		Message: "X-User-ID header missing or malformed",
		Code:    strconv.Itoa(http.StatusUnauthorized),
		TraceId: traceId.(string),
	}, w, http.StatusUnauthorized)
}

func ErrMissingXTraceId(_ context.Context, w http.ResponseWriter) {
	SendErrResponse(api.BadRequest{
		Message: "X-Request-ID header missing or malformed",
		Code:    strconv.Itoa(http.StatusBadRequest),
		TraceId: "not-found",
	}, w, http.StatusBadRequest)
}

func SendErrResponse(apiResponse api.ApiErrorResponse, w http.ResponseWriter, statusCode int) {
	apiResponseJson, err := json.Marshal(apiResponse)
	if err != nil {
		http.Error(w, InternalServerError, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	_, err = w.Write(apiResponseJson)
	if err != nil {
		http.Error(w, InternalServerError, http.StatusInternalServerError)
		return
	}
}
