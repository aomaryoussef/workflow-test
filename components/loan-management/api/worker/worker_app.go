package worker

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/api/metrics"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/btechlabs/lms/config"
	"github.com/btechlabs/lms/internal/app/infra/event_store"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	glpostingjob "github.com/btechlabs/lms/internal/domain/accounting/gl/job"
	slpostingjob "github.com/btechlabs/lms/internal/domain/accounting/subledger/job"
	financialproductjob "github.com/btechlabs/lms/internal/domain/financial_product/job"
	loanaccountjob "github.com/btechlabs/lms/internal/domain/loan_account/job"
	"github.com/btechlabs/lms/pkg/client/dynamics"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/otelx"
	"github.com/riverqueue/river"
)

func StartWorkers(ctx context.Context, conf config.Config, workerConcurrency int) error {
	log := logging.WithContext(ctx)

	otelShutdown, err := otelx.InitOpenTelemetryPipeline(ctx, conf, "worker")
	if err != nil {
		return err
	}

	driver, err := sql_driver.Connect(ctx, conf)
	if err != nil {
		return err
	}

	dynamicsClient := dynamics.NewDynamicsClient(conf)

	es := event_store.NewPgEventStore(driver)
	fpHandler := financialproductjob.NewFinancialProductJobHandler(driver, es)
	laHandler := loanaccountjob.NewLoanAccountJobHandler(driver, es, fmt.Sprintf("%s:%d", conf.AppConfig.Rpc.Host, conf.AppConfig.Rpc.Port))
	slHandler := slpostingjob.NewSubledgerJobHandler(driver)
	glHandler := glpostingjob.NewGeneralLedgerERPJobHandler(dynamicsClient, driver, conf.FeatureFlagsConfig.DisableGlIntegration)
	rc := newRiverClient(conf, driver, workerConcurrency, fpHandler, laHandler, slHandler, glHandler)

	sigintOrTerm := make(chan os.Signal, 1)
	signal.Notify(sigintOrTerm, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		if err := rc.Start(ctx); err != nil {
			log.Error(fmt.Sprintf("river client failed to start: %v", err))
			sigintOrTerm <- syscall.SIGTERM
			return
		}
		log.Info("river client started and listening to incoming job_queue")
		log.Info(fmt.Sprintf("default queue worker concurrency: %d", workerConcurrency))
	}()

	metricsServer := metrics.BuildMetricsServer(conf)
	go func() {
		if err := metricsServer.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			log.Warn(fmt.Sprintf("metrics server error: %v", err))
		}
	}()

	<-sigintOrTerm
	log.Info("received SIGINT/SIGTERM; initiating soft stop")

	softStopCtx, softStopCtxCancel := context.WithTimeout(ctx, 10*time.Second)
	defer softStopCtxCancel()

	go func() {
		select {
		case <-sigintOrTerm:
			log.Info("received SIGINT/SIGTERM again; initiating hard stop")
			softStopCtxCancel()
		case <-softStopCtx.Done():
			log.Info("Soft stop timeout; initiating hard stop")
		}
	}()

	if err := rc.Stop(softStopCtx); err != nil &&
		!errors.Is(err, context.DeadlineExceeded) &&
		!errors.Is(err, context.Canceled) {

		return err
	}
	if err == nil {
		log.Info("soft stop succeeded")
		return nil
	}

	shutdownCtx, hardStopCtxCancel := context.WithTimeout(ctx, 10*time.Second)
	defer hardStopCtxCancel()

	if err := rc.StopAndCancel(shutdownCtx); err != nil && errors.Is(err, context.DeadlineExceeded) {
		log.Warn("hard stop timeout; ignoring stop procedure and exiting unsafely")
	} else if err != nil {
		return err
	}

	log.Info("hard stop succeeded")

	select {
	case <-rc.Stopped():
		log.Info("soft stop succeeded")
	case <-time.After(100 * time.Millisecond):
		sigintOrTerm <- syscall.SIGTERM
		<-rc.Stopped()
	}

	if err := otelShutdown(ctx); err != nil {
		log.Warn(fmt.Sprintf("open telemetry pipeline shutdown error: %v", err))
	}
	log.Info("open telemetry pipeline shutdown complete")

	if err := metricsServer.Shutdown(shutdownCtx); err != nil {
		log.Warn(fmt.Sprintf("metrics server error: %v", err))
	}
	log.Info("metrics server graceful shutdown complete")
	return nil
}

func newRiverClient(
	_ config.Config,
	driver *sql_driver.SqlDriver,
	workerConcurrency int,
	fpHandler *financialproductjob.FinancialProductJobHandler,
	laHandler *loanaccountjob.LoanAccountJobHandler,
	slHandler *slpostingjob.SubledgerJobHandler,
	glHandler *glpostingjob.GeneralLedgerERPJobHandler,
) *river.Client[sql_driver.Tx] {
	return riverx.NewWorkerClientBuilder().
		WithSqlxDB(driver).
		WithDefaultQueueConcurrency(workerConcurrency).
		WithWorker(func(workers *river.Workers) {
			// Register workers here when new workers are added

			// Financial product workers
			river.AddWorker[financialproductjob.WriteFinancialProduct](workers, &DecoratorWorker[financialproductjob.WriteFinancialProduct]{Handler: fpHandler.UpsertFinancialProduct, LinearRetryBackoffSeconds: 5})
			river.AddWorker[financialproductjob.UpdateFinancialProductState](workers, &DecoratorWorker[financialproductjob.UpdateFinancialProductState]{Handler: fpHandler.UpdateFinancialProductState, LinearRetryBackoffSeconds: 5})
			// Loan account workers
			river.AddWorker[loanaccountjob.CreateLoanAccount](workers, &DecoratorWorker[loanaccountjob.CreateLoanAccount]{Handler: laHandler.CreateLoanAccount, LinearRetryBackoffSeconds: 10})
			river.AddWorker[loanaccountjob.ActivateLoanAccount](workers, &DecoratorWorker[loanaccountjob.ActivateLoanAccount]{Handler: laHandler.ActivateLoanAccount, LinearRetryBackoffSeconds: 10})
			river.AddWorker[loanaccountjob.CancelLoanAccount](workers, &DecoratorWorker[loanaccountjob.CancelLoanAccount]{Handler: laHandler.CancelLoanAccount, LinearRetryBackoffSeconds: 10})
			river.AddWorker[loanaccountjob.UpdateEarlySettlementDetails](workers, &DecoratorWorker[loanaccountjob.UpdateEarlySettlementDetails]{Handler: laHandler.UpdateEarlySettlementDetails, LinearRetryBackoffSeconds: 10})
			river.AddWorker[loanaccountjob.ProcessPaymentLoanAccount](workers, &DecoratorWorker[loanaccountjob.ProcessPaymentLoanAccount]{Handler: laHandler.ProcessPaymentForLoan, LinearRetryBackoffSeconds: 10})
			// Triggers
			river.AddWorker[loanaccountjob.RevenueRecognitionTrigger](workers, &DecoratorWorker[loanaccountjob.RevenueRecognitionTrigger]{Handler: laHandler.RecogniseRevenue, LinearRetryBackoffSeconds: 10})
			river.AddWorker[loanaccountjob.TriggerBookLoanDuesFromPayment](workers, &DecoratorWorker[loanaccountjob.TriggerBookLoanDuesFromPayment]{Handler: laHandler.TriggerBookDuesLoanAccount, LinearRetryBackoffSeconds: 10})
			// Accounting workers
			river.AddWorker[slpostingjob.SlLoanActivation](workers, &DecoratorWorker[slpostingjob.SlLoanActivation]{Handler: slHandler.PostLoanActivation, LinearRetryBackoffSeconds: 10})
			river.AddWorker[glpostingjob.GlLoanActivation](workers, &DecoratorWorker[glpostingjob.GlLoanActivation]{Handler: glHandler.PostLoanActivation})
			river.AddWorker[slpostingjob.SlLoanCancellation](workers, &DecoratorWorker[slpostingjob.SlLoanCancellation]{Handler: slHandler.PostLoanCancellation, LinearRetryBackoffSeconds: 10})
			river.AddWorker[glpostingjob.GlLoanCancellation](workers, &DecoratorWorker[glpostingjob.GlLoanCancellation]{Handler: glHandler.PostLoanCancellation})
			river.AddWorker[slpostingjob.SlRevenueRecognition](workers, &DecoratorWorker[slpostingjob.SlRevenueRecognition]{Handler: slHandler.PostRevenueRecognition, LinearRetryBackoffSeconds: 10})
			river.AddWorker[glpostingjob.GlRevenueRecognition](workers, &DecoratorWorker[glpostingjob.GlRevenueRecognition]{Handler: glHandler.PostRevenueRecognition})
			river.AddWorker[slpostingjob.SlBookPayment](workers, &DecoratorWorker[slpostingjob.SlBookPayment]{Handler: slHandler.BookPayment, LinearRetryBackoffSeconds: 10})
			river.AddWorker[glpostingjob.GlBookPayment](workers, &DecoratorWorker[glpostingjob.GlBookPayment]{Handler: glHandler.BookPayment})
			river.AddWorker[slpostingjob.SlLoanBookPayment](workers, &DecoratorWorker[slpostingjob.SlLoanBookPayment]{Handler: slHandler.BookLoanPayment, LinearRetryBackoffSeconds: 10})
			river.AddWorker[glpostingjob.GlLoanBookPayment](workers, &DecoratorWorker[glpostingjob.GlLoanBookPayment]{Handler: glHandler.BookLoanPayment})
		}).
		Build()
}
