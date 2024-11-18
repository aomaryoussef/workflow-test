package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	httpxerrors "github.com/btechlabs/lms/api/httpx/errors"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/internal/app/infra/command_bus"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/contextx"
	appError "github.com/btechlabs/lms/pkg/errors"
	"github.com/btechlabs/lms/pkg/logging"
)

func (s *HttpServer) CreateLoanAccount(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.CreateLoanAccount{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewCreateLoanAccountCmd(ctx, requestBody)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		if errors.Is(err, command_bus.ErrCommandValidationFailure) {
			httpxerrors.SendErrResponse(api.ApiErrorResponse{
				Code:    "validation_error",
				Message: err.Error(),
				TraceId: ctx.Value(contextx.ContextKeyRequestId).(string),
			}, w, http.StatusBadRequest)
			return
		} else if errors.Is(err, appError.ErrPreConditionsError) {
			httpxerrors.SendErrResponse(api.ApiErrorResponse{
				Code:    "preconditions_error",
				Message: err.Error(),
				TraceId: ctx.Value(contextx.ContextKeyRequestId).(string),
			}, w, http.StatusUnprocessableEntity)
			return
		} else if errors.Is(err, appError.ErrConflictError) {
			httpxerrors.ErrConflictError(ctx, w, err)
			return
		}
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	addLocationHeader(w, fmt.Sprintf("/loan-accounts/%s", result.AggregateId))
	w.WriteHeader(http.StatusAccepted)
}

func (s *HttpServer) ActivateLoanAccount(w http.ResponseWriter, r *http.Request, id string, params api.ActivateLoanAccountParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.ActivateLoanAccountRequest{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewActivateLoanAccountCmd(ctx, id, params, requestBody)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		if errors.Is(err, command_bus.ErrCommandValidationFailure) {
			httpxerrors.SendErrResponse(api.ApiErrorResponse{
				Code:    "validation_error",
				Message: err.Error(),
				TraceId: ctx.Value(contextx.ContextKeyRequestId).(string),
			}, w, http.StatusBadRequest)
			return
		}
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

func (s *HttpServer) EarlySettleLoanAccount(w http.ResponseWriter, r *http.Request, id string, params api.EarlySettleLoanAccountParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.EarlySettleLoanAccountRequest{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewEarlySettleLoanAccountCmd(ctx, id, params, requestBody)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		if errors.Is(err, command_bus.ErrCommandValidationFailure) {
			httpxerrors.SendErrResponse(api.ApiErrorResponse{
				Code:    "validation_error",
				Message: err.Error(),
				TraceId: ctx.Value(contextx.ContextKeyRequestId).(string),
			}, w, http.StatusBadRequest)
			return
		}
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

func (s *HttpServer) CancelLoanAccount(w http.ResponseWriter, r *http.Request, id string, params api.CancelLoanAccountParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.CancelLoanAccount{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		log.Warn(fmt.Sprintf("failed to decode request body: %s", err.Error()))
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewCancelLoanAccountCmd(ctx, id, params, requestBody)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		if errors.Is(err, command_bus.ErrCommandValidationFailure) {
			httpxerrors.SendErrResponse(api.ApiErrorResponse{
				Code:    "validation_error",
				Message: err.Error(),
				TraceId: ctx.Value(contextx.ContextKeyRequestId).(string),
			}, w, http.StatusBadRequest)
			return
		}
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}
