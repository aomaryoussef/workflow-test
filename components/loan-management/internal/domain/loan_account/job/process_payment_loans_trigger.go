package job

import (
	"context"
	"errors"
	"fmt"
	"github.com/btechlabs/lms/internal/app/infra/sql_driver"
	"github.com/btechlabs/lms/internal/domain/loan_account/storage"
	"github.com/btechlabs/lms/internal/types"
	"github.com/btechlabs/lms/pkg/job"
	"github.com/btechlabs/lms/pkg/logging"
	"github.com/btechlabs/lms/pkg/money"
	"net/rpc"
	"sort"
	"time"
)

type unpaidInstalment struct {
	LoanAccountId      string
	CreatedAt          time.Time
	InstalmentNumber   uint32
	InstalmentDueDate  time.Time
	GracePeriodEndDate time.Time
	LoanBalanceUnits   uint64
	PrincipalDue       uint64
	InterestDue        uint64
	PenaltyDue         uint64
	TotalInstalmentDue uint64
}

var _ job.JobArgsWithHeader = (*TriggerBookLoanDuesFromPayment)(nil)

type TriggerBookLoanDuesFromPayment struct {
	Header            job.MessageHeader `json:"header"`
	EventId           string            `json:"event_id"`
	PaymentRegistryId string            `json:"payment_registry_id"`
	BookedAt          time.Time         `json:"booked_at"`
	AppliedCurrency   string            `json:"applied_currency"`
	PaidUnits         uint64            `json:"paid_units"`
	PayorId           string            `json:"payor_id"`
}

func (a TriggerBookLoanDuesFromPayment) MessageHeader() job.MessageHeader {
	return a.Header
}

func (a TriggerBookLoanDuesFromPayment) Kind() string {
	return types.JobTypeBookLoanDuesFromPaymentTrigger.String()
}

func (h *LoanAccountJobHandler) TriggerBookDuesLoanAccount(ctx context.Context, args job.JobArgsWithHeader) error {
	log := logging.WithContext(ctx)
	request := args.(TriggerBookLoanDuesFromPayment)
	tx, err := h.db.CreateTransactionReadOnly(ctx)
	if err != nil {
		return err
	}
	defer sql_driver.HandleTxOutcomeWithRecover(ctx, tx, log, err)

	// Fetch all loans by PayorId
	applicableLoanIds, err := storage.GetLoanIdsForConsumer(ctx, tx, request.PayorId)
	if err != nil {
		return err
	}

	loanAccounts, err := h.loadLoanAccountAggregates(ctx, applicableLoanIds, request.EventId, tx)
	if err != nil {
		return err
	}
	unpaidDues := make([]unpaidInstalment, 0)

	for _, loanAccount := range loanAccounts {
		unpaidDuesItems := loanAccount.AmmortisationLineItems.GetUnpaidDues()
		for _, unpaidDue := range unpaidDuesItems {
			unpaidDues = append(unpaidDues, unpaidInstalment{
				LoanAccountId:      loanAccount.Id,
				CreatedAt:          loanAccount.CreatedAtUTC.ToStdLibTime(),
				InstalmentNumber:   unpaidDue.ScheduleNumber,
				InstalmentDueDate:  unpaidDue.InstalmentDueAt.ToStdLibTime(),
				GracePeriodEndDate: unpaidDue.GracePeriodDueAt.ToStdLibTime(),
				LoanBalanceUnits:   unpaidDue.LoanBalance.Amount(),
				PrincipalDue:       unpaidDue.PrincipalDue.Amount(),
				InterestDue:        unpaidDue.InterestDue.Amount(),
				PenaltyDue:         unpaidDue.PenaltyDue.Amount(),
				TotalInstalmentDue: money.AsPtr(unpaidDue.TotalDue()).Amount(),
			})
		}
	}

	// For all unpaid dues, we will iterate through all loans
	// and pay dues from the payment until the full payment is utilised
	// Also with every iteration, we will pay the dues in the order of
	// Penalty, Admin Fee, Vat, Interest, Principal
	// We will also apply the payment to the loan with the oldest due date
	// first
	sort.Slice(unpaidDues, func(i, j int) bool {
		// If instalment due dates are different, then use them
		// to determine whether element i is less than element j.
		if !unpaidDues[i].InstalmentDueDate.Equal(unpaidDues[j].InstalmentDueDate) {
			return unpaidDues[i].InstalmentDueDate.Before(unpaidDues[j].InstalmentDueDate)
		}
		// Otherwise, use created at time to determine whether
		// element i is less than element j. Remember sort by
		// creation time implicitly means sort old loans first
		return unpaidDues[i].CreatedAt.Before(unpaidDues[j].CreatedAt)
	})

	remainingAmountToBeBooked := request.PaidUnits

	// Iterate through all unpaid dues
	for _, unpaidDue := range unpaidDues {
		// Remove the code below when we have late fees
		err = ensureZeroUnitsForUnsupportedDues(unpaidDue)
		if err != nil {
			return err
		}
		if remainingAmountToBeBooked == 0 {
			log.Info("payment fully utilised")
			break
		}
		if remainingAmountToBeBooked < unpaidDue.TotalInstalmentDue {
			log.Info("payment fully utilised")
			break
		}

		// Pay dues
		cmd := types.NewApplyLoanPaymentCmd(ctx)
		cmd.LoanId = unpaidDue.LoanAccountId
		cmd.BorrowerId = request.PayorId
		cmd.InstalmentScheduleNumber = unpaidDue.InstalmentNumber
		cmd.AppliedCurrency = request.AppliedCurrency
		cmd.PaidUnits = unpaidDue.TotalInstalmentDue
		cmd.PaymentReferenceId = request.PaymentRegistryId
		cmd.PaymentDate = request.BookedAt

		client, err := rpc.DialHTTP("tcp", h.rpcServerAddr)
		if err != nil {
			log.Error(fmt.Sprintf("rpc client dial error: %s", err.Error()))
			return err
		}
		result := types.CmdProcessorResult{}
		err = client.Call("RpcCommandBus.ProcessLoanPayment", cmd, &result)
		if err != nil {
			log.Error(fmt.Sprintf("rpc_command_bus.apply_loan_payment error: %s", err.Error()))
			return err
		}
		remainingAmountToBeBooked -= unpaidDue.TotalInstalmentDue
	}

	return nil
}

func ensureZeroUnitsForUnsupportedDues(unpaidDue unpaidInstalment) error {
	if unpaidDue.PenaltyDue > 0 {
		return errors.New(fmt.Sprintf("penalty dues (late fees) are not supported yet for loan account %s and instalment schedule: %d", unpaidDue.LoanAccountId, unpaidDue.InstalmentNumber))
	}
	return nil
}
