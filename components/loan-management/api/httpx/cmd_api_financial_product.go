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

// CreateFinancialProduct creates a new financial product
// swagger:route POST /financial-products financial-product CreateFinancialProduct
func (s *HttpServer) CreateFinancialProduct(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.CreateFinancialProduct{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		log.Error(err.Error())
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewCreateFinancialProductCmd(ctx, requestBody)
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
		} else if errors.Is(err, appError.ErrConflictError) {
			httpxerrors.ErrConflictError(ctx, w, err)
			return
		} else {
			httpxerrors.ErrInternalServerError(ctx, w)
			return
		}
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	addLocationHeader(w, fmt.Sprintf("/financial-products/%s", result.AggregateId))
	w.WriteHeader(http.StatusAccepted)
}

// DeleteFinancialProduct soft deletes a financial product.
// The ETag header must be provided to ensure that the client is operating on the latest version of the resource.
// swagger:route DELETE /financial-products/{key} financial-product DeleteFinancialProduct
func (s *HttpServer) DeleteFinancialProduct(w http.ResponseWriter, r *http.Request, key string, params api.DeleteFinancialProductParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	incomingETag := params.IfMatch
	if incomingETag == 0 {
		httpxerrors.ErrMissingMandatoryETag(ctx, w)
		return
	}

	cmd := types.NewDeleteFinancialProductCmd(ctx, key, params)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

// UpdateFinancialProduct updates a financial product.
// The ETag header must be provided to ensure that the update is based on the latest version.
// swagger:route PUT /financial-products/{key} financial-product UpdateFinancialProduct
func (s *HttpServer) UpdateFinancialProduct(w http.ResponseWriter, r *http.Request, key string, params api.UpdateFinancialProductParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.UpdateFinancialProduct{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	incomingETag := params.IfMatch
	if incomingETag == 0 {
		httpxerrors.ErrMissingMandatoryETag(ctx, w)
		return
	}

	cmd := types.NewUpdateFinancialProductCmd(ctx, key, params, requestBody)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		// check error type and return appropriate response
		logCommandProcessFailure(log, cmd, err)
		checkErr := appError.ErrAggregateVersionMismatch
		if errors.Is(err, checkErr) {
			httpxerrors.ErrUnprocessableEntityError(ctx, w, err)
			return
		} else {
			httpxerrors.ErrInternalServerError(ctx, w)
			return
		}
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

// ApproveFinancialProduct approves a financial product.
// The ETag header must be provided to ensure that the client is operating on the latest version of the resource.
// swagger:route POST /financial-products/{key}/approve financial-product ApproveFinancialProduct
func (s *HttpServer) ApproveFinancialProduct(w http.ResponseWriter, r *http.Request, key string, params api.ApproveFinancialProductParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	incomingETag := params.IfMatch
	if incomingETag == 0 {
		httpxerrors.ErrMissingMandatoryETag(ctx, w)
		return
	}

	cmd := types.NewApproveFinancialProductCmd(ctx, key, params)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		if errors.Is(err, appError.ErrAggregateVersionMismatch) {
			httpxerrors.ErrUnprocessableEntityError(ctx, w, err)
			return
		} else if errors.Is(err, appError.ErrNotFound) {
			httpxerrors.ErrEntityNotFound(ctx, w, err)
			return
		} else {
			httpxerrors.ErrInternalServerError(ctx, w)
			return
		}
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

// PublishFinancialProduct publishes a financial product.
// The ETag header must be provided to ensure that the client is operating on the latest version of the resource.
// swagger:route POST /financial-products/{key}/publish financial-product PublishFinancialProduct
func (s *HttpServer) PublishFinancialProduct(w http.ResponseWriter, r *http.Request, key string, params api.PublishFinancialProductParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	incomingETag := params.IfMatch
	if incomingETag == 0 {
		httpxerrors.ErrMissingMandatoryETag(ctx, w)
		return
	}

	cmd := types.NewPublishFinancialProductCmd(ctx, key, params)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		checkErr := appError.ErrAggregateVersionMismatch
		if errors.Is(err, checkErr) {
			httpxerrors.ErrUnprocessableEntityError(ctx, w, err)
			return
		} else {
			httpxerrors.ErrInternalServerError(ctx, w)
			return
		}
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}

// UnpublishFinancialProduct unpublishes a financial product.
// The ETag header must be provided to ensure that the client is operating on the latest version of the resource.
// swagger:route POST /financial-products/{key}/unpublish financial-product UnpublishFinancialProduct
func (s *HttpServer) UnpublishFinancialProduct(w http.ResponseWriter, r *http.Request, key string, params api.UnpublishFinancialProductParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	incomingETag := params.IfMatch
	if incomingETag == 0 {
		httpxerrors.ErrMissingMandatoryETag(ctx, w)
		return
	}

	cmd := types.NewUnpublishFinancialProductCmd(ctx, key, params)
	result, err := s.commands.Dispatch(ctx, cmd)
	if err != nil {
		logCommandProcessFailure(log, cmd, err)
		checkErr := appError.ErrAggregateVersionMismatch
		if errors.Is(err, checkErr) {
			httpxerrors.ErrUnprocessableEntityError(ctx, w, err)
			return
		} else {
			httpxerrors.ErrInternalServerError(ctx, w)
			return
		}
	}

	addETagHeader(w, result.AggregateVersion.Primitive())
	w.WriteHeader(http.StatusAccepted)
}
