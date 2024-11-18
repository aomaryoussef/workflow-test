package usecase

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/btechlabs/lms-lite/config"
	"github.com/btechlabs/lms-lite/internal/clients/graphql"
	fADomain "github.com/btechlabs/lms-lite/modules/financialaccount/domain"
	financialAccount "github.com/btechlabs/lms-lite/modules/financialaccount/usecase"
	financialProductModel "github.com/btechlabs/lms-lite/modules/financialproduct/dto"
	financialProduct "github.com/btechlabs/lms-lite/modules/financialproduct/usecase"
	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	ga "github.com/btechlabs/lms-lite/modules/ga/usecase"
	journalDto "github.com/btechlabs/lms-lite/modules/journal/dto"
	journal "github.com/btechlabs/lms-lite/modules/journal/usecase"
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	"github.com/btechlabs/lms-lite/modules/servicing/dto"
	"github.com/btechlabs/lms-lite/modules/servicing/repository"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"github.com/google/uuid"
	. "github.com/samber/lo"
)

type ServicingUseCase interface {
	ActivateLoan(ctx context.Context, request dto.ActivateLoanRequest) (response *dto.ActivateLoanResponse, err error)
	CancelLoan(ctx context.Context, request dto.CancelLoanRequest) (response *dto.CancelLoanResponse, err error)
	RepayLoan(ctx context.Context, request dto.RepayLoanRequest) (repayLoanResponse *dto.RepayLoanResponse, err error)
	GetCommercialOffers(ctx context.Context, request dto.CreateCommercialOfferRequest) (offers []domain.CommercialOffer, err error)
	RecognizeInterestRevenueEarned(ctx context.Context, input *dto.EndOfDayRequest) (err error)
	GetAllLoansForConsumer(ctx context.Context, consumerId string) ([]*domain.Loan, error)
	GetAllLoansForMerchant(ctx context.Context, merchantId string, loanIds []string) ([]*domain.MerchantLoan, error)
	FilterCommercialOffers(ctx context.Context, request *dto.FilterCommercialOfferRequest, url, token string) (response *dto.FilterCommercialOfferResponse, err error)
}

type servicingUseCase struct {
	financialProduct financialProduct.FinancialProductUseCase
	financialAccount financialAccount.FinancialAccountUseCase
	journal          journal.JournalUseCase
	ga               ga.GaUseCase
	repo             repository.ServicingRepository
	vatPercentage    uint
}

func NewServicingUseCase(
	financialProduct financialProduct.FinancialProductUseCase,
	financialAccount financialAccount.FinancialAccountUseCase,
	journal journal.JournalUseCase,
	ga ga.GaUseCase,
	repo repository.ServicingRepository,
	conf config.EnvConfig,
) ServicingUseCase {

	return &servicingUseCase{
		financialProduct: financialProduct,
		financialAccount: financialAccount,
		journal:          journal,
		ga:               ga,
		repo:             repo,
		vatPercentage:    conf.VatPercentage,
	}
}

func (s *servicingUseCase) ActivateLoan(ctx context.Context, request dto.ActivateLoanRequest) (response *dto.ActivateLoanResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	correlationId := logging.ExtractCorrelationId(ctx)

	selectedOffer, err := s.repo.GetCommercialOfferById(ctx, request.SelectedOfferId)
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - error loading commercial offer id: %s: %v", request.SelectedOfferId, err)
		return nil, errors.New(errMsg)
	}

	if selectedOffer.ConsumerId != request.ConsumerId {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - offer's consumer id: %s and loan activation requests consumer id: %s does not match", selectedOffer.ConsumerId, request.ConsumerId)
		return nil, errors.New(errMsg)
	}

	fp, err := s.financialProduct.GetProduct(ctx, selectedOffer.FinancialProductKey, selectedOffer.FinancialProductVersion, false)
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - error getting product definition for key %s with version %s: %s", selectedOffer.FinancialProductKey, selectedOffer.FinancialProductVersion, err)
		return nil, errors.New(errMsg)
	}

	// 2. Validate the consumer's financial account
	consumer, err := s.financialAccount.FindConsumerAccount(ctx, request.ConsumerId)
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - error loading consumer financial account: %v, check in lms financial accounts if this consumer exists", err)
		return nil, errors.New(errMsg)
	}

	if !consumer.IsActive() {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - consumer account id: %s is not active", request.ConsumerId)
		return nil, errors.New(errMsg)
	}

	// 3. Validate the merchant's financial account
	merchantAccount, err := s.financialAccount.FindMerchantAccount(ctx, request.MerchantId)
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - error loading merchant account id: %s: %v", request.MerchantId, err)
		return nil, errors.New(errMsg)
	}
	if merchantAccount.Status != fADomain.PartyAccountStatusActive {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - merchant account id: %s not active", merchantAccount.GlobalReferenceId)
		return nil, errors.New(errMsg)
	}

	// 4. Get the loan schedule from financial product
	requestedPrincipal := money.NewMoney(selectedOffer.FinancedAmount.Units())
	logger.Infof("Consumer %s requested principal %s", selectedOffer.ConsumerId, requestedPrincipal)

	bookingTimeUTC, err := time.Parse(time.RFC3339, request.LoanApplicationBookingTime)
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - parsing booking time %s failed with error: %s, send in RFC3339 format", request.LoanApplicationBookingTime, err)
		return nil, errors.New(errMsg)
	}
	// we ensure even if the caller sends in a different timezone, we store it in UTC
	bookingTimeUTC = bookingTimeUTC.UTC()

	ammortizationSchedule, err := s.financialProduct.
		CalculateAmmortizationSchedule(
			ctx,
			financialProductModel.AmmortizationScheduleRequest{
				TenorKey:                selectedOffer.Tenure,
				FinancialProductKey:     fp.Key(),
				FinancialProductVersion: fp.Version(),
				NetPrincipalAmount:      *requestedPrincipal,
				LoanBookingTimeUTC:      bookingTimeUTC,
				RepaymentDay:            request.ConsumerSingleRepaymentDay,
			})
	if err != nil {
		errMsg := fmt.Sprintf("servicing_usecase#ActivateLoan - ammortization schedule failed error: %v", err)
		return nil, errors.New(errMsg)
	}

	logger.Infof("servicing_usecase#ActivateLoan - ammortization schedule generated for consumer %s with %d instalment", selectedOffer.ConsumerId, len(ammortizationSchedule.PaymentSchedule))

	loan, err := domain.NewLoanBuilderFromLoanApplication(
		request.MerchantId,
		request.ConsumerId,
		bookingTimeUTC,
		correlationId,
		selectedOffer,
		ammortizationSchedule).
		Build()
	if err != nil {
		return nil, err
	}

	totalInterest, err := fp.TotalInterestPayable(requestedPrincipal, selectedOffer.Tenure)
	if err != nil {
		return nil, err
	}
	logger.Infof("Consumer %s loan total interest payable %s on requested principal %s", selectedOffer.ConsumerId, totalInterest, requestedPrincipal)

	// 5. Insert audit entries
	err = s.repo.InsertCommand(ctx, domain.Command{
		Type:          domain.CommandTypeActivateLoan,
		ConsumerId:    request.ConsumerId,
		CorrelationId: correlationId,
		CreatedAt:     time.Now(),
		Entries: []domain.Entry{
			{
				Type:   domain.EntryTypePrincipal,
				Amount: -int64(requestedPrincipal.Units()),
			},
			{
				Type:   domain.EntryTypeInterest,
				Amount: -int64(totalInterest.Units()),
			},
		},
	})
	if err != nil {
		logger.Errorf("Failed to record command for auditing, aborting loan activation, error: %s", err)
		return nil, err
	}
	logger.Debugf("Command with correlation id %s recorded", correlationId)

	// 6. Create loan record with schedule
	err = s.repo.CreateLoan(ctx, *loan)
	if err != nil {
		logger.Errorf("Failed to create loan record with error: %s", err)
		return nil, err
	}
	logger.Infof("Loan saved for consumer %s with id %s", selectedOffer.ConsumerId, loan.Id())
	// TODO: share3a requirement

	// 7. Create book-keeping entries
	adminFee, err := fp.AdminFee(requestedPrincipal, s.vatPercentage, selectedOffer.Tenure)
	if err != nil {
		logger.Errorf("Failed to calculate admin fee for the selected offer with error: %s", err)
		return nil, err
	}
	err = s.journal.BookActivateLoan(ctx, loan.Id(), correlationId, requestedPrincipal.Units(), totalInterest.Units(), bookingTimeUTC, adminFee.Units())
	if err != nil {
		logger.Errorf("Failed to book loan with error: %s", err)
		return nil, err
	}
	logger.Infof("Loan %s booked on journal with booking date %s", loan.Id(), bookingTimeUTC)

	merchantPayableAmount := requestedPrincipal.Units() - adminFee.Units()
	err = s.ga.BookLoanTransactionSlip(ctx, gaDto.LoanTransactionRequest{
		LoanId:            loan.Id(),
		OrderNumber:       selectedOffer.BasketId,
		MerchantAccountId: request.MerchantId,
		LoanAmount:        merchantPayableAmount,
		BookingTime:       bookingTimeUTC,
	})
	if err != nil {
		logger.Errorf("Failed to record merchant disbursement with error: %s", err)
		return nil, err
	}
	logger.Infof("Merchant %s disbursement amount %s recorded", request.MerchantId, requestedPrincipal)

	return &dto.ActivateLoanResponse{
		ActivatedLoan: dto.ActivatedLoanOutput{
			LoanId:                loan.Id(),
			OrderNumber:           "TODO",             //global unique id for merchant. not the same as lms internal merchant id
			MerchantAccountId:     merchantAccount.Id, // global unique id for merchant. not the same as lms internal merchant id
			LoanAmount:            requestedPrincipal.Units(),
			BookingTime:           bookingTimeUTC,
			MerchantPayableAmount: merchantPayableAmount,
		},
	}, nil
}

func (s *servicingUseCase) CancelLoan(ctx context.Context, request dto.CancelLoanRequest) (response *dto.CancelLoanResponse, err error) {
	contextUserId := ctx.Value(logging.UserIdContextKey)
	if contextUserId == nil || contextUserId.(string) == "" {
		return nil, fmt.Errorf("user id not found in context")
	}
	correlationId := logging.ExtractCorrelationId(ctx)

	cancellationTime, err := time.Parse(time.RFC3339, request.CancellationTime)
	if err != nil {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - parsing cancellation time %s failed with error: %v", request.CancellationTime, err)
	}
	cancellationTime = cancellationTime.UTC()

	// Validate the consumer's financial account
	consumer, err := s.financialAccount.FindConsumerAccount(ctx, request.ConsumerId)
	if err != nil {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - error loading consumer financial account: %v", err)
	}
	if !consumer.IsActive() {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - consumer account id: %s is not active", request.ConsumerId)
	}

	// Validate the merchant's financial account and consciously we do not check merchant account status
	merchantAccount, err := s.financialAccount.FindMerchantAccount(ctx, request.MerchantId)
	if err != nil {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - error loading merchant financial account: %v", err)
	}

	// check if loan is still in active status
	loan, err := s.repo.GetLoan(ctx, request.LoanId)
	if err != nil {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - error loading loan with id: %v", err)
	}
	loanStatus := loan.CurrentStatus()
	if loanStatus.StatusType() != domain.LoanStatusActive {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - loan status is not active, cannot cancel")
	}

	// check consumer id is connected to this loan (loan table's consumer_id column)
	if loan.ConsumerId() != request.ConsumerId {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - consumer id: %s is not connected to this loan", request.ConsumerId)
	}
	// check merchant id is connected to this loan (loan table's merchant_id column)
	if loan.MerchantId() != request.MerchantId {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - merchant id: %s is not connected to this loan", request.MerchantId)
	}

	// get principal and total interest for active loan by reversing from schedule
	schedule := loan.PaymentSchedule()
	totalPrincipal := money.NewMoney(0)
	totalInterest := money.NewMoney(0)
	// for each ammortisation schedule, ensure the consumer paid, as the loan is being cancelled
	for _, i := range schedule.LineItems() {
		principalDue := i.PrincipalDue()
		totalPrincipal = totalPrincipal.AddMoney(&principalDue)
		interestDue := i.InterestDue()
		totalInterest = totalInterest.AddMoney(&interestDue)
		lateFeeDue := i.LateFeeDue()
		totalMoneyOwed := money.NewMoney(principalDue.UnitsOrZero() + interestDue.UnitsOrZero() + lateFeeDue.UnitsOrZero())
		updatedLoanSchedule, errBookPayment := loan.BookPaymentForSchedule(ctx, i.Id(), request.ReferenceId, *totalMoneyOwed, cancellationTime)
		if errBookPayment != nil {
			return nil, fmt.Errorf("servicing_usecase#CancelLoan - failed to settle payment terms for schedule with id: %d due to error: %s", i.Id(), errBookPayment.Error())
		}

		err = s.repo.BookPayment(ctx, updatedLoanSchedule, contextUserId.(string))
		if err != nil {
			return nil, fmt.Errorf("servicing_usecase#CancelLoan - failed to get loan with id: %s due to error: %s", request.LoanId, err.Error())
		}
	}

	// reverse disbursement for merchant
	err = s.ga.CancelLoanTransactionSlip(ctx, &gaDto.CancelLoanTransactionRequest{
		LoanId:            loan.Id(),
		MerchantAccountId: request.MerchantId,
		LoanAmount:        totalPrincipal.Units(),
		BookingTime:       cancellationTime,
	})

	if err != nil {
		if err.Error() == "MERCHANT_UNRELATED" {
			return nil, fmt.Errorf("servicing_usecase#CancelLoan - not the same merchant %s as on original transaction slip, check who acquired consumer return request", request.MerchantId)
		}
		return nil, err
	}

	// credit account receivables for full repayment except admin fee
	err = s.journal.BookCancelLoan(ctx, loan.Id(), correlationId, totalPrincipal.Units(), totalInterest.Units(), cancellationTime, loan.AdminFee().Units())
	if err != nil {
		return nil, fmt.Errorf("servicing_usecase#CancelLoan - failed to book loan cancellation with error: %s", err)
	}

	// update loan's status to cancelled
	err = s.repo.CancelLoan(ctx, loan.Id(), cancellationTime)
	if err != nil {
		return nil, err
	}

	return &dto.CancelLoanResponse{
		LoanAmount:                totalPrincipal.Units(),
		LoanId:                    loan.Id(),
		MerchantAccountId:         merchantAccount.Id, // global unique id for merchant. not the same as lms internal merchant id
		MerchantCancellableAmount: -int64(totalPrincipal.Units() - loan.AdminFee().Units()),
	}, nil
}

func (s *servicingUseCase) RepayLoan(ctx context.Context, request dto.RepayLoanRequest) (repayLoanResponse *dto.RepayLoanResponse, err error) {
	err = request.Validate()
	if err != nil {
		return nil, err
	}
	if !request.CollectedAsEarlySettlement {
		return s.repayLoanForSchedule(ctx, request)
	} else {
		return s.repayLoanAsEarlySettlement(ctx, request)
	}
}

func (s *servicingUseCase) GetLoan(ctx context.Context, id string) (loan *domain.Loan, err error) {
	loan, err = s.repo.GetLoan(ctx, id)
	if err != nil {
		return nil, err
	}

	return
}

func (s *servicingUseCase) GetCommercialOffers(ctx context.Context, request dto.CreateCommercialOfferRequest) ([]domain.CommercialOffer, error) {
	const maximumAvailableTenure int = 5000
	logger := logging.LogHandle.WithContext(ctx)

	allOffers, err := s.repo.GetCommercialOffersByBasketId(ctx, request.BasketId)
	if err != nil {
		logger.Errorf("Failed to get commercial offer by basket id:%s with error  %s", request.BasketId, err)
		return nil, err
	}

	if len(allOffers) > 0 {
		return allOffers, nil
	}

	for _, selectedFp := range request.SelectedFinancialProducts {
		fp, err := s.financialProduct.GetProduct(ctx, selectedFp.ProductKey, selectedFp.ProductVersion, false)
		if err != nil {
			logger.Errorf("Failed to get product for generating commercial offers with error %s", err)
			return nil, err
		}

		for _, v := range fp.TenorVariants() {
			if int(v.DurationInDays()) > maximumAvailableTenure {
				logger.Debugf("Skipping tenor variant key %s due to duration is longer than max available tenor %d", v.Key(), maximumAvailableTenure)
				continue // skip those that has longer value than max tenure
			}
			principalAmount := money.NewMoney(request.PrincipalAmount.Units)

			minAllowedDownPayment := v.MinimumAllowedDownpaymentForPrincipal(principalAmount)
			maxAllowedDownPayment := v.MaximumAllowedDownpaymentForPrincipal(principalAmount)

			var totalAvailableLimit money.Money
			if request.CreditLimit != nil {
				totalAvailableLimit = *money.NewMoney(request.CreditLimit.Units)
			} else {
				totalAvailableLimit = *money.NewMoney(0)
			}

			coa := commercialOfferAvailable(totalAvailableLimit, *principalAmount, minAllowedDownPayment, maxAllowedDownPayment)
			if coa.rejected {
				allOffers = append(allOffers, domain.CommercialOffer{
					Id:                      uuid.NewString(),
					ConsumerId:              request.ConsumerId,
					BasketId:                request.BasketId,
					FinancialProductKey:     selectedFp.ProductKey,
					FinancialProductVersion: selectedFp.ProductVersion,
					Tenure:                  v.Key(),
					BasketAmount:            principalAmount,
					Rejected:                true,
					RejectionReason:         coa.rejectionReason,
				})
				continue
			}
			// add back downpayment to be subtracted from principalAmount
			financedAmount := money.NewMoney(request.PrincipalAmount.Units - coa.appliedDownPayment.Units())
			if !fp.IsPrincipalAllowed(financedAmount) {
				logger.Errorf("Principal %d is out of range for financial product (%d-%d), offer for tenor %s skipped", financedAmount.Units(), fp.MinimumApplicablePrincipal().Units(), fp.MaximumApplicablePrincipal().Units(), v.Key())
				allOffers = append(allOffers, domain.CommercialOffer{
					Id:                      uuid.NewString(),
					ConsumerId:              request.ConsumerId,
					BasketId:                request.BasketId,
					FinancialProductKey:     selectedFp.ProductKey,
					FinancialProductVersion: selectedFp.ProductVersion,
					Tenure:                  v.Key(),
					BasketAmount:            principalAmount,
					Rejected:                true,
					RejectionReason:         fmt.Sprintf("financed amount: %s is out of range for this financial product principal range (%s-%s) and tenor: %s", financedAmount.ReadableNotationWithCurrency(), fp.MinimumApplicablePrincipal().ReadableNotationWithCurrency(), fp.MaximumApplicablePrincipal().ReadableNotationWithCurrency(), v.Key()),
				})
				continue
			}

			adminFee, err := fp.AdminFee(financedAmount, s.vatPercentage, v.Key())
			if err != nil {
				logger.Errorf("Failed calculating admin fee for tenor key %s with error %s", v.Key(), err)
				return nil, err
			}

			annualPercentageRate, err := fp.AnnualPercentageRate(financedAmount, money.NewMoney(adminFee.Units()), v.Key())
			if err != nil {
				logger.Errorf("Failed calculating annual percentage rate of key %s with error %s", v.Key(), err)
				return nil, err
			}
			annualInterestPercentage, err := fp.AnnualInterestPercentage(v.Key())
			if err != nil {
				logger.Errorf("Failed calculating annual interest percentage of key %s with error %s", v.Key(), err)
				return nil, err
			}
			flatEffectiveRate, err := fp.FlatEffectiveRate(financedAmount, v.Key())
			if err != nil {
				logger.Errorf("Failed calculating flat effective rate of key %s with error %s", v.Key(), err)
				return nil, err
			}
			interestPayable, err := fp.TotalInterestPayable(financedAmount, v.Key())
			if err != nil {
				logger.Errorf("Failed calculating total interest payable of key %s with error %s", v.Key(), err)
				return nil, err
			}

			monthlyInstalment, err := fp.MonthlyInstalment(financedAmount, v.Key())
			if err != nil {
				logger.Errorf("Failed calculating monthly instalment of key %s with error %s", v.Key(), err)
				return nil, err
			}

			total := principalAmount.AddMoney(interestPayable).AddMoney(adminFee)
			if err != nil {
				logger.Errorf("Failed calculating financed of key %s with error %s", v.Key(), err)
				return nil, err
			}

			appliedDownPayment := coa.appliedDownPayment
			allOffers = append(allOffers, domain.CommercialOffer{
				Id:                       uuid.NewString(),
				ConsumerId:               request.ConsumerId,
				BasketId:                 request.BasketId,
				FinancialProductKey:      selectedFp.ProductKey,
				FinancialProductVersion:  selectedFp.ProductVersion,
				Tenure:                   v.Key(),
				AdminFee:                 adminFee,
				DownPayment:              &appliedDownPayment,
				AnnualInterestPercentage: fmt.Sprintf("%.2f", annualInterestPercentage*100),
				FinancedAmount:           financedAmount,                                                  // Financed amount (Total amount – downpayment) - (you have this from Conductor Input data)
				InterestRatePerTenure:    fmt.Sprintf("%.2d", v.Phases()[0].Interest().BasisPoints()/100), // TODO: how to calculate this? // Interest rate per tenure [%] (you have this from financial product)
				TotalAmount:              total,                                                           // Total amount the customer will pay including downpayment, admin fees, and interest rate) (you also have this from Financial product)
				MonthlyInstalment:        monthlyInstalment,                                               // Monthly payment per tenure (you have this from the calculation)
				AnnualPercentageRate:     fmt.Sprintf("%.2f", annualPercentageRate*100),
				FlatEffectiveRate:        fmt.Sprintf("%.2f", flatEffectiveRate*100),
				BasketAmount:             principalAmount,
				Rejected:                 false,
			})
		}
	}

	logger.Debugf("total commercial offers (incl. the rejected ones): %d", len(allOffers))

	acceptedOffers := Filter(allOffers, func(item domain.CommercialOffer, index int) bool {
		return item.Rejected == false
	})
	if len(acceptedOffers) < 1 {
		logger.Errorf("No offers were generated, see logs for skipping reasons!")
		return nil, fmt.Errorf("No offers generated for basket, see logs for reasons")
	}

	err = s.repo.InsertCommercialOffers(ctx, acceptedOffers)

	// remember we insert only the accepted offers
	// but send back all offers incl. rejected ones
	// so that the task can create nice conductor logs
	// for debugging
	if err != nil {
		logger.Errorf("Failed to insert commercial offers with error %s", err.Error())
		return allOffers, err
	}

	return allOffers, nil
}

func (s *servicingUseCase) RecognizeInterestRevenueEarned(ctx context.Context, input *dto.EndOfDayRequest) (err error) {
	logger := logging.LogHandle.WithContext(ctx)
	correlationId := logging.ExtractCorrelationId(ctx)
	logger.Infof("Start recognizing interest revenues")

	dateRangeStart, err := time.Parse(time.RFC3339, input.DateRangeStart)
	if err != nil {
		logger.Errorf("Failed to parse date range start %s as RFC3339 format with error: %s", input.DateRangeStart, err)
		return err
	}
	dateRangeEnd, err := time.Parse(time.RFC3339, input.DateRangeEnd)
	if err != nil {
		logger.Errorf("Failed to parse date range end %s as RFC3339 format with error: %s", input.DateRangeEnd, err)
		return err
	}

	logger.Infof("Processing interest revenue recognitions from %s to %s", dateRangeStart, dateRangeEnd)

	// list all loans maturing (due date) in the given date range
	loanIds, err := s.repo.ListLoansDueOn(ctx, dateRangeStart, dateRangeEnd)
	if err != nil {
		logger.Errorf("Failed to list maturing loans with error %s", err)
		return err
	}

	logger.Infof("Found %d loans maturing between %s and %s, recognizing interest revenue per loan", len(loanIds), dateRangeStart, dateRangeEnd)

	// record double entry bookkeeping records for each loan
	var lastErrHappened error
	numberOfErrorLines := 0
	for _, loanId := range loanIds {
		loan, err := s.repo.GetLoan(ctx, loanId)
		if err != nil {
			logger.Errorf("Failed to get loan by id %s with error %s", loanId, err)
			numberOfErrorLines++
			lastErrHappened = err
			continue
		}

		schedule := loan.PaymentSchedule()
		logger.Debugf("Date start %s and date end %s", dateRangeStart, dateRangeEnd)
		var interestDue money.Money
		// detect actual line(s) that is/are due in given date range!
		// TODO: query appropriately the only payment schedule lines that are relevant!
		for _, sli := range schedule.LineItems() {
			dueDate := sli.InstalmentDueDateUTC()
			if (dueDate == dateRangeStart || dueDate.After(dateRangeStart)) && dueDate.Before(dateRangeEnd) { // replicating SQL's BETWEEN behaviour
				interestDue = sli.InterestDue()
				break
			}
		}
		logger.Infof("Booking %d interest revenue earned for loan %s", interestDue, loanId)
		// TODO: make book interest earned idempotent per id per date!
		err = s.journal.BookInterestEarned(ctx, loan.Id(), correlationId, interestDue.Units(), dateRangeEnd)
		if err != nil {
			logger.Errorf("Failed to recognize %d interest earned for loan id %s with error %s", interestDue, loan.Id(), err)
			numberOfErrorLines++
			lastErrHappened = err
		}
	}

	return lastErrHappened
}

func (s *servicingUseCase) GetAllLoansForConsumer(ctx context.Context, consumerId string) ([]*domain.Loan, error) {
	logging.LogHandle.WithContext(ctx).Debugf("Getting all loans for consumer %s", consumerId)
	loans, err := s.repo.GetAllLoansForConsumer(ctx, consumerId)
	if err != nil {
		logging.LogHandle.WithContext(ctx).Errorf("Failed to get all loans for consumer %s with error %v", consumerId, err)
		return nil, err
	}
	return loans, nil
}

func (s *servicingUseCase) GetAllLoansForMerchant(ctx context.Context, merchantId string, loanIds []string) ([]*domain.MerchantLoan, error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Infof("Getting all_loan for merchant %s", merchantId)
	loans, err := s.repo.GetAllLoansForMerchant(ctx, merchantId, loanIds)
	if err != nil {
		logger.Errorf("Failed to get all_loan for merchant %s with error %v", merchantId, err)
		return nil, err
	}
	return loans, nil
}

func (s *servicingUseCase) FilterCommercialOffers(ctx context.Context, request *dto.FilterCommercialOfferRequest, url, token string) (*dto.FilterCommercialOfferResponse, error) {
	logger := logging.LogHandle.WithContext(ctx)
	logger.Info("Filtering commercial offers")
	client := graphql.NewCreditRiskClient(url, token)
	filterRequest := &graphql.CommercialOffersRequest{}

	filterRequest.Request.SSN = request.SSN
	for _, offer := range request.OfferDetails {
		filterRequest.Request.Offers = append(filterRequest.Request.Offers, &graphql.OfferDetails{
			Id:                       offer.Id,
			Tenure:                   offer.Tenure,
			AdminFee:                 offer.AdminFee,
			FinancedAmount:           offer.FinancedAmount.ConvertTOPound(),
			TotalAmount:              offer.TotalAmount.ConvertTOPound(),
			AnnualInterestPercentage: offer.AnnualInterestPercentage,
			InterestRatePerTenure:    offer.InterestRatePerTenure,
			DownPayment:              offer.DownPayment.ConvertTOPound(),
			MonthlyInstalment:        offer.MonthlyInstalment.ConvertTOPound(),
		})
	}

	filteredOffers, err := client.FilterCommercialOffers(ctx, filterRequest)
	if err != nil {
		logger.Errorf("Failed to filter commercial offers with error %v", err)
		return nil, err
	}

	if filteredOffers == nil {
		logger.Errorf("Failed to filter commercial offers with error %v", err)
		return nil, err
	}
	response := &dto.FilterCommercialOfferResponse{}

	response.RejectionReason = filteredOffers.ResponseData.ValidatedOffers.RejectionReason
	response.Status = filteredOffers.ResponseData.ValidatedOffers.Status.String()

	for _, offer := range filteredOffers.ResponseData.ValidatedOffers.OffersDetails {
		if offer.Status != graphql.APPROVED_ACTIVE {
			continue
		}
		response.OffersDetails = append(response.OffersDetails, &dto.OfferDetails{
			Id:                       offer.OfferDetails.Id,
			Tenure:                   offer.OfferDetails.Tenure,
			AdminFee:                 offer.OfferDetails.AdminFee,
			FinancedAmount:           offer.OfferDetails.FinancedAmount.ConvertTOCent(),
			TotalAmount:              offer.OfferDetails.TotalAmount.ConvertTOCent(),
			AnnualInterestPercentage: offer.OfferDetails.AnnualInterestPercentage,
			InterestRatePerTenure:    offer.OfferDetails.InterestRatePerTenure,
			DownPayment:              offer.OfferDetails.DownPayment.ConvertTOCent(),
			MonthlyInstalment:        offer.OfferDetails.MonthlyInstalment.ConvertTOCent(),
		})
	}

	return response, nil
}

func (s *servicingUseCase) repayLoanForSchedule(ctx context.Context, request dto.RepayLoanRequest) (repayLoanResponse *dto.RepayLoanResponse, err error) {
	contextUserId := ctx.Value(logging.UserIdContextKey)
	if contextUserId == nil || contextUserId.(string) == "" {
		return nil, fmt.Errorf("user id not found in context")
	}

	loanScheduleId := *request.BillingAccountScheduleId

	logger := logging.
		LogHandle.
		WithContext(ctx).
		WithFields(map[string]string{
			"loan_id":                 request.BillingAccount,
			"collection_process_type": "REGULAR_COLLECTION",
			"schedule_id":             strconv.FormatUint(loanScheduleId, 10),
		})

	loan, err := s.repo.GetLoan(ctx, request.BillingAccount)
	if err != nil {
		err = fmt.Errorf("failed to get loan with id: %s due to error: %s", request.BillingAccount, err.Error())
		return
	}

	scheduleNumberInLoan := -1
	if request.BillingAccountScheduleId != nil {
		paymentSchedule := loan.PaymentSchedule()
		scheduleNumberInLoan = paymentSchedule.ScheduleNumberInLoan(*request.BillingAccountScheduleId)
	}

	// Comment: Currently the scope implemented is either the entire
	// amount is paid or nothing is paid. This is not the best approach
	// and in future, we will allow partial payments.
	// For now we just select the first item in the schedule that is not paid
	// Logic:
	// 1. Update the loan schedule table
	// 2. Insert journal entries
	updatedLoanSchedule, err := loan.BookPaymentForSchedule(
		ctx,
		loanScheduleId,
		request.PaymentReferenceId,
		request.PaidAmountUnits,
		request.BookingTime,
	)
	if err != nil {

		switch {
		case errors.Is(err, domain.ErrRecurringPaymentRequestWithSameRefId):
			principalDue := updatedLoanSchedule.PrincipalDue()
			interestDue := updatedLoanSchedule.InterestDue()
			lateFeeDue := updatedLoanSchedule.LateFeeDue()

			scheduleIdPtr := strconv.FormatUint(loanScheduleId, 10)
			repayLoanResponse = &dto.RepayLoanResponse{
				LoanId:               updatedLoanSchedule.LoanId(),
				ScheduleId:           &scheduleIdPtr,
				ScheduleNumberInLoan: scheduleNumberInLoan,
				PaymentReferenceId:   *updatedLoanSchedule.RefId(),
				BookedAt:             *updatedLoanSchedule.PaidDate(),
				TotalAmountPaid:      request.PaidAmountUnits.UnitsOrZero(),
				TotalPrincipalPaid:   updatedLoanSchedule.PaidPrincipal().UnitsOrZero(),
				TotalInterestPaid:    updatedLoanSchedule.PaidInterest().UnitsOrZero(),
				TotalLateFeePaid:     updatedLoanSchedule.PaidLateFee().UnitsOrZero(),
				TotalPrincipalDue:    principalDue.UnitsOrZero(),
				TotalInterestDue:     interestDue.UnitsOrZero(),
				TotalLateFeeDue:      lateFeeDue.UnitsOrZero(),
			}
			return repayLoanResponse, nil
		default:
			return nil, err
		}
	}

	logger.Info("update loan schedule, persisting the changes")
	err = s.repo.BookPayment(ctx, updatedLoanSchedule, contextUserId.(string))
	if err != nil {
		err = fmt.Errorf("failed to get loan with id: %s due to error: %s", request.BillingAccount, err.Error())
		return
	}

	logger.Info("update journal entries, persisting the changes")
	err = s.journal.BookPaymentReceived(ctx, journalDto.BookPaymentReceivedRequest{
		LoanId:             request.BillingAccount,
		CorrelationId:      request.PaymentReferenceId,
		BookedAt:           request.BookingTime,
		TotalAmountPaid:    request.PaidAmountUnits,
		TotalPrincipalPaid: updatedLoanSchedule.PaidPrincipal(),
		TotalInterestPaid:  updatedLoanSchedule.PaidInterest(),
		TotalLateFeePaid:   updatedLoanSchedule.PaidLateFee(),
		CollectionMethod:   journalDto.CollectionMethod(request.CollectionMethod),
	})
	if err != nil {
		return
	}

	principalDue := updatedLoanSchedule.PrincipalDue()
	interestDue := updatedLoanSchedule.InterestDue()
	lateFeeDue := updatedLoanSchedule.LateFeeDue()

	scheduleIdPtr := strconv.FormatUint(loanScheduleId, 10)
	repayLoanResponse = &dto.RepayLoanResponse{
		LoanId:                     request.BillingAccount,
		ScheduleId:                 &scheduleIdPtr,
		ScheduleNumberInLoan:       scheduleNumberInLoan,
		CollectedAsEarlySettlement: false,
		PaymentReferenceId:         request.PaymentReferenceId,
		BookedAt:                   request.BookingTime,
		TotalAmountPaid:            request.PaidAmountUnits.UnitsOrZero(),
		TotalPrincipalPaid:         updatedLoanSchedule.PaidPrincipal().UnitsOrZero(),
		TotalInterestPaid:          updatedLoanSchedule.PaidInterest().UnitsOrZero(),
		TotalLateFeePaid:           updatedLoanSchedule.PaidLateFee().UnitsOrZero(),
		TotalPrincipalDue:          principalDue.UnitsOrZero(),
		TotalInterestDue:           interestDue.UnitsOrZero(),
		TotalLateFeeDue:            lateFeeDue.UnitsOrZero(),
	}
	return
}

func (s *servicingUseCase) repayLoanAsEarlySettlement(ctx context.Context, request dto.RepayLoanRequest) (repayLoanResponse *dto.RepayLoanResponse, err error) {
	contextUserId := ctx.Value(logging.UserIdContextKey)
	if contextUserId == nil || contextUserId.(string) == "" {
		return nil, fmt.Errorf("user id not found in context")
	}
	correlationId := logging.ExtractCorrelationId(ctx)

	logger := logging.
		LogHandle.
		WithContext(ctx).
		WithFields(map[string]string{
			"loan_id":                 request.BillingAccount,
			"collection_process_type": "EARLY_SETTLEMENT_COLLECTION",
		})
	bookingTimeUTC := request.BookingTime.UTC()

	logger.Infof("start booking payment for early settlement")

	loan, err := s.repo.GetLoan(ctx, request.BillingAccount)
	if err != nil {
		err = fmt.Errorf("failed to get loan with id: %s due to error: %s", request.BillingAccount, err.Error())
		return
	}

	logger.Infof("found the loan with id: %s", request.BillingAccount)

	loanCurrentStatus := loan.CurrentStatus()
	earlySettlementDetails := loan.EarlySettlementDetails()
	paymentSchedule := loan.PaymentSchedule()
	if loanCurrentStatus.StatusType() != domain.LoanStatusActive || !earlySettlementDetails.IsEarlySettlementAvailable {
		err = fmt.Errorf("loan %s is not active or early settlement is not possible", request.BillingAccount)
		return nil, err
	}

	cancelledSchedules := paymentSchedule.CancelAllUnpaidSchedules(bookingTimeUTC, contextUserId.(string))
	if len(cancelledSchedules) == 0 {
		err = fmt.Errorf("no valid unpaid schedules for loan with id: %s found for early settlement", request.BillingAccount)
		return nil, err
	}
	generatedNewSchedule := loan.GenerateEarlySettlementSchedule(request.BookingTime, request.PaymentReferenceId)

	err = s.repo.EarlySettleLoan(ctx, loan.Id(), bookingTimeUTC, cancelledSchedules, generatedNewSchedule)
	if err != nil {
		return nil, err
	}

	err = s.journal.BookEarlySettlementReceived(ctx, journalDto.BookEarlySettlementReceivedRequest{
		LoanId:                  loan.Id(),
		PaymentReferenceId:      request.PaymentReferenceId,
		CorrelationId:           correlationId,
		BookedAt:                bookingTimeUTC,
		TotalAmountPaid:         request.PaidAmountUnits,
		TotalPrincipalPaid:      *earlySettlementDetails.EarlySettlementPrincipalDue,
		TotalInterestPaid:       *earlySettlementDetails.EarlySettlementFeesDue,
		TotalInitialInterestDue: *earlySettlementDetails.InitialInterestReceivable,
		WithoutAllowance:        earlySettlementDetails.WithoutAllowance,
		WithoutInterest:         earlySettlementDetails.WithoutInterest,
		CollectionMethod:        journalDto.CollectionMethod(request.CollectionMethod),
	})
	if err != nil {
		return nil, err
	}

	repayLoanResponse = &dto.RepayLoanResponse{
		LoanId:                     loan.Id(),
		CollectedAsEarlySettlement: true,
		PaymentReferenceId:         request.PaymentReferenceId,
		BookedAt:                   bookingTimeUTC,
		TotalPrincipalPaid:         generatedNewSchedule.PaidPrincipal().UnitsOrZero(),
		TotalInterestPaid:          generatedNewSchedule.PaidInterest().UnitsOrZero(),
		TotalLateFeePaid:           generatedNewSchedule.PaidLateFee().UnitsOrZero(),
		TotalPrincipalDue:          generatedNewSchedule.PaidPrincipal().UnitsOrZero(),
		TotalInterestDue:           generatedNewSchedule.PaidInterest().UnitsOrZero(),
		TotalLateFeeDue:            generatedNewSchedule.PaidLateFee().UnitsOrZero(),
	}

	return
}

type commercialOfferAvailability struct {
	rejected           bool
	rejectionReason    string
	appliedDownPayment money.Money
}

func commercialOfferAvailable(totalAvailableLimit money.Money, principalAmount money.Money, minDownPayment money.Money, maxDownPayment money.Money) commercialOfferAvailability {
	if totalAvailableLimit.Units() >= principalAmount.Units() {
		// if the total available limit is greater than the basket value, then do a min down payment
		return commercialOfferAvailability{
			rejected:           false,
			rejectionReason:    "",
			appliedDownPayment: *money.NewMoney(minDownPayment.Units()),
		}
	}

	differenceForDownPaymentUnits := principalAmount.Units() - totalAvailableLimit.Units()
	if differenceForDownPaymentUnits > maxDownPayment.Units() {
		// if the difference between the basket value and the total available limit is greater than the max down payment, then the offer is not available
		return commercialOfferAvailability{
			rejected:           true,
			rejectionReason:    fmt.Sprintf("difference in down payment: %s is greater than the max down payment: %s", money.NewMoney(differenceForDownPaymentUnits).ReadableNotationWithCurrency(), maxDownPayment.ReadableNotationWithCurrency()),
			appliedDownPayment: *money.NewMoney(0),
		}
	}

	// if the difference between the basket value and the total available limit is less than the max down payment, then do the difference as down payment
	return commercialOfferAvailability{
		rejected:           false,
		rejectionReason:    "",
		appliedDownPayment: *money.NewMoney(differenceForDownPaymentUnits),
	}
}
