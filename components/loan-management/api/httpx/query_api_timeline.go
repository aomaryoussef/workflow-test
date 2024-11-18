package httpx

import (
	httpxerrors "github.com/btechlabs/lms/api/httpx/errors"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/pkg/logging"
	"net/http"
)

func (s *HttpServer) GetTimeline(w http.ResponseWriter, r *http.Request, params api.GetTimelineParams) {
	ctx := r.Context()
	log := logging.WithContext(ctx)

	timelineEvents, err := s.queries.ListTimelineEvents(r.Context(), params)
	if err != nil {
		log.Warn("failed to list timeline events", err)
		httpxerrors.ErrInternalServerError(ctx, w)
		return
	}

	SendApiResponse(w, timelineEvents, http.StatusOK)
}
