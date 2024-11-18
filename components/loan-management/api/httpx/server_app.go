package httpx

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/api/metrics"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"log/slog"
	"net/http"
	"net/rpc"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/btechlabs/lms/api/httpx/middleware"
	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/gen/api"
	"github.com/btechlabs/lms/internal/app/command"
	"github.com/btechlabs/lms/internal/app/infra/command_bus"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/app/query"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
)

func StartHttpServer(ctx context.Context, conf config.Config) error {
	log := logging.WithContext(ctx)
	// OpenTelemetry
	otelShutdown, err := otelx.InitOpenTelemetryPipeline(ctx, conf, "server")
	if err != nil {
		return err
	}

	// SQL Database Driver
	driver, err := sql_driver.Connect(ctx, conf)
	if err != nil {
		panic(err)
	}
	log.Info("connected to pg database successfully")

	// Event Store
	es := event_store.NewPgEventStore(driver)

	// Command Bus
	commands := command.NewCommands(
		es,
		driver,
		riverx.NewRiverClientForJobInserts(driver),
		conf.FeatureFlagsConfig.AllowLoanCancellationAfterInterestRecognition,
	)
	httpCommandBus := command_bus.NewHttpCommandBus(commands)
	rpcCommandBus := command_bus.NewRpcCommandBus(commands)
	log.Info("command bus created successfully")

	queries := query.NewQueries(driver, es)
	log.Info("queries created successfully")

	httpServer := buildHttpServer(conf, httpCommandBus, queries, log)
	go func() {
		if err := httpServer.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Warn(fmt.Sprintf("http server error: %v", err))
		}
		log.Info("http server stopped serving new connections")
	}()

	rpcServer := buildRpcServer(conf, rpcCommandBus, log)
	go func() {
		if err := rpcServer.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Warn(fmt.Sprintf("rpc server error: %v", err))
		}
	}()

	metricsServer := metrics.BuildMetricsServer(conf)
	go func() {
		if err := metricsServer.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Warn(fmt.Sprintf("metrics server error: %v", err))
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan

	err = otelShutdown(ctx)
	if err != nil {
		log.Warn(fmt.Sprintf("open telemetry pipeline shutdown error: %v", err))
	}
	log.Info("open telemetry pipeline shutdown complete")

	shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownRelease()

	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		log.Warn(fmt.Sprintf("http server error: %v", err))
	}
	log.Info("http server graceful shutdown complete")

	if err := rpcServer.Shutdown(shutdownCtx); err != nil {
		log.Warn(fmt.Sprintf("rpc server error: %v", err))
	}

	if err := metricsServer.Shutdown(shutdownCtx); err != nil {
		log.Warn(fmt.Sprintf("metrics server error: %v", err))
	}
	log.Info("metrics server graceful shutdown complete")

	return nil
}

func buildHttpServer(conf config.Config, commandBus *command_bus.HttpCommandBus, queries *query.Queries, log *slog.Logger) *http.Server {
	appRouter := chi.NewMux()
	appRouter.Use(chiMiddleware.Logger)
	appRouter.Use(middleware.RequestID)
	appRouter.Use(middleware.UserId)
	appRouter.Use(otelhttp.NewMiddleware(fmt.Sprintf("%s-server", conf.AppConfig.Name)))
	appRouter.Use(middleware.ContextSetUp)
	appRouter.Use(middleware.Recoverer)

	httpSrv := NewHttpServer(
		WithConfig(conf),
		WithCommands(*commandBus),
		WithQueries(queries),
		WithLogger(log),
	)
	appRouterHandler := api.Handler(httpSrv)
	appRouter.Mount("/", appRouterHandler)

	s := &http.Server{
		Handler: appRouter,
		Addr:    fmt.Sprintf(":%d", conf.AppConfig.Http.Port),
	}

	return s
}

func buildRpcServer(conf config.Config, commandBus *command_bus.RpcCommandBus, log *slog.Logger) *http.Server {
	rpcSrv := rpc.NewServer()
	err := rpcSrv.Register(commandBus)
	if err != nil {
		log.Error(fmt.Sprintf("rpc server registration error: %s", err.Error()))
		panic(err)
	}

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", conf.AppConfig.Rpc.Port),
		Handler: rpcSrv,
	}
	return srv
}
