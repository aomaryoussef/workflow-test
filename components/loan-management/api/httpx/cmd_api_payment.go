package httpx

import (
	"encoding/json"
	"errors"
	httpxerrors "github.com/btechlabs/lms/api/httpx/errors"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/internal/app/infra/command_bus"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/contextx"
	"github.com/btechlabs/lms/pkg/logging"
	"net/http"
)

func (s *HttpServer) BookPayment(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	requestBody := api.PaymentProcessRequest{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	cmd := types.NewPaymentProcessCmd(ctx, requestBody)
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
