package metrics

import (
	"fmt"
	"github.com/btechlabs/lms/config"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"net/http"
)

func BuildMetricsServer(conf config.Config) *http.Server {
	appMetricsRouter := chi.NewMux()
	appMetricsRouter.Use(chiMiddleware.Logger)
	appMetricsRouter.Handle("/metrics", promhttp.Handler())

	srv := &http.Server{
		Handler: appMetricsRouter,
		Addr:    fmt.Sprintf(":%d", conf.AppConfig.Metrics.Port),
	}
	return srv
}
