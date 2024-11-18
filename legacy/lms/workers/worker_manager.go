package workers

import (
	"context"
	"fmt"

	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/cancellation"
	"github.com/btechlabs/lms-lite/workers/checkout"
	"github.com/btechlabs/lms-lite/workers/collection"
	"github.com/btechlabs/lms-lite/workers/disbursement"
	"github.com/btechlabs/lms-lite/workers/endofday"
	"github.com/btechlabs/lms-lite/workers/notification"
	"github.com/btechlabs/lms-lite/workers/onboarding"
	"github.com/conductor-sdk/conductor-go/sdk/client"
	"github.com/conductor-sdk/conductor-go/sdk/settings"
	"github.com/conductor-sdk/conductor-go/sdk/worker"
)

type ConductorWorkerManager struct {
	taskWorkers []libWorker.DecoratorTaskWorker
	coreApp     app.Application
}

// TODO Add a ping method for the conductor server
// TODO We must check if conductor is reachable before starting our app
func NewConductorWorkerManager(coreApp app.Application) *ConductorWorkerManager {
	m := &ConductorWorkerManager{
		taskWorkers: make([]libWorker.DecoratorTaskWorker, 0),
		coreApp:     coreApp,
	}

	return m
}

func (c *ConductorWorkerManager) registerWorker(taskWorker libWorker.TaskWorker) {
	decorator := libWorker.NewDecoratorTaskWorker(taskWorker, c.coreApp.GetConnectionManager())
	c.taskWorkers = append(c.taskWorkers, decorator)
}

func (c *ConductorWorkerManager) RegisterWorkers() *ConductorWorkerManager {

	c.registerWorker(checkout.NewActivateLoanTask(c.coreApp))
	c.registerWorker(checkout.NewLoadFinancialProductTask(c.coreApp))
	c.registerWorker(checkout.NewCommercialOfferTask(c.coreApp))
	c.registerWorker(checkout.NewFilterCommercialOfferTask(c.coreApp))

	c.registerWorker(disbursement.NewBookTransactionSlipTask(c.coreApp))
	c.registerWorker(disbursement.NewBookMerchantInvoicesTask(c.coreApp))
	c.registerWorker(disbursement.NewUpdateDisbursementTask(c.coreApp))
	c.registerWorker(disbursement.NewGABookMerchantInvoicesTask(c.coreApp))
	c.registerWorker(disbursement.NewGaBookCancelledInvoicesTask(c.coreApp))

	c.registerWorker(onboarding.NewOpenConsumerAccountTask(c.coreApp))
	c.registerWorker(onboarding.NewOpenMerchantAccountTask(c.coreApp))
	c.registerWorker(onboarding.NewGAOpenConsumerAccountTask(c.coreApp))
	c.registerWorker(onboarding.NewGAOpenMerchantAccountTask(c.coreApp))
	c.registerWorker(onboarding.NewUpdateConsumerAccountStatusTask(c.coreApp))
	c.registerWorker(onboarding.NewUpdateMerchantAccountStatusTask(c.coreApp))

	c.registerWorker(endofday.NewEndOfDayAggregatesTask(c.coreApp))
	c.registerWorker(endofday.NewRecognizeInterestRevenueTask(c.coreApp))
	c.registerWorker(endofday.NewGAEndOfDayAggregatesTask(c.coreApp))
	c.registerWorker(endofday.NewAggregateCollectionAccountsTask(c.coreApp))
	c.registerWorker(endofday.NewPostAggregatedCollectionTask(c.coreApp))
	c.registerWorker(endofday.NewAggregateLoanCancellationTask(c.coreApp))
	c.registerWorker(endofday.NewPostAggregatedLoanCancellationTask(c.coreApp))

	c.registerWorker(cancellation.NewCancelLoanTask(c.coreApp))

	// Collections
	c.registerWorker(collection.NewBookConsumerCollectionLmsTask(c.coreApp))
	c.registerWorker(collection.NewBookConsumerCollectionMyloTreasuryTask(c.coreApp))
	c.registerWorker(collection.NewBookConsumerCollectionBtechTreasuryTask(c.coreApp))
	c.registerWorker(collection.NewProcessMyloRepaymentsTask(c.coreApp))
	c.registerWorker(collection.NewBookConsumerCollectionToTreasuryTask(c.coreApp))

	// Notifications
	c.registerWorker(notification.NewNotifyCollectionBookingStatusTask(c.coreApp))
	return c
}

func (c *ConductorWorkerManager) StartWorkers(ctx context.Context) error {
	conductorClient := newConductorClient(c.coreApp.EnvConfig().Orkes.Url)
	taskRunner := worker.NewTaskRunnerWithApiClient(conductorClient)
	for i := 0; i < len(c.taskWorkers); i++ {
		err := taskRunner.StartWorker(
			c.taskWorkers[i].GetName(),
			c.taskWorkers[i].GetTaskFunction(),
			c.taskWorkers[i].GetBatchSize(),
			c.taskWorkers[i].GetPollInterval(),
		)
		if err != nil {
			logging.LogHandle.WithContext(ctx).Errorf("Error on start worker", err)
			return err
		}
	}

	taskRunner.WaitWorkers()
	return nil
}

// TODO Move this to pkg/client
func newConductorClient(conductorUrl string) (c *client.APIClient) {
	c = client.NewAPIClient(
		&settings.AuthenticationSettings{}, // TODO: Replace with API key and security
		settings.NewHttpSettings(fmt.Sprintf("%s/api", conductorUrl)),
	)
	return
}
