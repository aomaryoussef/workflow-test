package job

import (
	"context"
	"fmt"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/client/riverx"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"net/rpc"
	"time"
)

var _ job.JobArgsWithHeader = (*RevenueRecognitionTrigger)(nil)

type RevenueRecognitionTrigger struct {
	Header                   job.MessageHeader `json:"header"`
	LoanId                   string            `json:"loan_id"`
	LenderSource             string            `json:"lender_source"`
	BookedAt                 time.Time         `json:"booked_at"`
	InstalmentScheduleNumber uint32            `json:"instalment_schedule_number"`
	RevenueUnits             uint64            `json:"revenue_units"`
	AppliedCurrency          string            `json:"applied_currency"`
	ShouldSnooze             bool              `json:"should_snooze"`
}

func (t RevenueRecognitionTrigger) MessageHeader() job.MessageHeader {
	return t.Header
}

func (RevenueRecognitionTrigger) Kind() string {
	return types.JobTypeRevenueRecognitionTrigger.String()
}

// RecogniseRevenue processes a revenue recognition trigger for a loan account.
// It constructs a RecogniseRevenueCmd command with the provided job arguments and sends it to the RPC server.
// This ensures the revenue recognition is persisted as an event on the loan account aggregate.
//
// Parameters:
// - ctx: The context.Context instance for controlling cancellations and timeouts.
// - args: The job.JobArgsWithHeader instance containing the job arguments.
//
// Returns:
//   - An error if the RPC client fails to dial, the RPC call fails, or if there is an error in the command processing.
//     On success, returns nil indicating the revenue recognition was triggered successfully.
func (h *LoanAccountJobHandler) RecogniseRevenue(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)

	request := args.(RevenueRecognitionTrigger)
	if request.ShouldSnooze {
		log.Info(fmt.Sprintf("snnozing job for 100 hours"))
		return riverx.ErrSnoozeJob100Hours
	}

	cmd := types.NewRecogniseRevenueCmd(ctx)
	cmd.LoanId = request.LoanId
	cmd.LenderSource = request.LenderSource
	cmd.InstalmentScheduleNumber = request.InstalmentScheduleNumber
	cmd.AppliedCurrency = request.AppliedCurrency
	cmd.RevenueUnits = request.RevenueUnits
	cmd.DueDate = request.BookedAt

	client, err := rpc.DialHTTP("tcp", h.rpcServerAddr)
	if err != nil {
		log.Error(fmt.Sprintf("rpc client dial error: %s", err.Error()))
		return err
	}
	result := types.CmdProcessorResult{}
	err = client.Call("RpcCommandBus.RecogniseInterestRevenue", cmd, &result)
	if err != nil {
		log.Error(fmt.Sprintf("rpc_command_bus.recognise_revenue error: %s", err.Error()))
		return err
	}

	log.Info(fmt.Sprintf("triggered recognise revenue for loan account: %s and instalment number: %d", request.LoanId, request.InstalmentScheduleNumber))
	return nil
}
