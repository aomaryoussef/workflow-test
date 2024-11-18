package workers

import (
	"fmt"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/modules/servicing/domain"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/cancellation"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
	"testing"
)

func (suite *WorkersIntegrationTestSuite) TestCancelLoanSingleWorklow() {
	t := suite.T()
	app := suite.coreApp
	baseTask := model.Task{
		TaskDefName: "lms_cancel_loan",
		TaskId:      "lms_cancel_loan",
		TaskDefinition: &model.TaskDef{
			Name: "lms_cancel_loan",
		},
		WorkflowType: "workflow-type-001",
		WorkflowTask: &model.WorkflowTask{
			Name:              "lms_cancel_loan",
			TaskReferenceName: "lms_cancel_loan",
		},
		WorkerId:           "inst-001fgutc",
		WorkflowInstanceId: "workflow-id-001",
		CorrelationId:      "correlation-id-001",
		InputData:          make(map[string]interface{}),
	}
	
	insertFinancialAccounts := func(db *sqlx.DB) {
		tx := db.MustBegin()
		tx.MustExec(
			`INSERT INTO public.party_account (id, global_reference_id, account_type, account_status, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
			1, "consumer-id-001", "INDIVIDUAL_ACCOUNT", "ACTIVE", "2023-03-01T00:00:00Z", "2023-03-01T00:00:00Z",
		)
		tx.MustExec(
			`INSERT INTO public.party_account (id, global_reference_id, account_type, account_status, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
			2, "merchant-global-id-001", "MERCHANT_ACCOUNT", "ACTIVE", "2023-03-01T00:00:00Z", "2023-03-01T00:00:00Z",
		)
		tx.MustExec(
			`INSERT INTO public.party_account (id, global_reference_id, account_type, account_status, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
			3, "consumer-id-002", "INDIVIDUAL_ACCOUNT", "ACTIVE", "2023-03-01T00:00:00Z", "2023-03-01T00:00:00Z",
		)
		tx.MustExec(
			`INSERT INTO public.party_account (id, global_reference_id, account_type, account_status, updated_at, created_at) VALUES ($1, $2, $3, $4, $5, $6)`,
			4, "merchant-global-id-002", "MERCHANT_ACCOUNT", "ACTIVE", "2023-03-01T00:00:00Z", "2023-03-01T00:00:00Z",
		)
		_ = tx.Commit()
	}
	
	insertExampleCommercialOffer := func(db *sqlx.DB) {
		tx := db.MustBegin()
		tx.MustExec(
			`INSERT INTO public.commercial_offer(id, consumer_id, basket_id, tenure, admin_fee, financed_amount, total_amount, down_payment, monthly_instalment, interest_rate_per_tenure, annual_interest_percentage, consumer_accepted_at, merchant_acccepted_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
			"commercial-offer-id-001", "consumer-id-001", "basket-001", "3_Months", 123000, 123000, 123000, 123000, 123000, "44 %", "44 %", "2023-03-06T00:00:00Z", "2023-03-06T00:00:00Z",
		)
		
		_ = tx.Commit()
	}
	
	insertExampleLoanAndSchedule := func(db *sqlx.DB) {
		tx := db.MustBegin()
		tx.MustExec(
			`INSERT INTO public.loan (id, financial_product_key, financial_product_version, correlation_id, booked_at, created_at, created_by, consumer_id, merchant_global_id, commercial_offer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			"b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "financial-product-key-001", "financial-product-version-001", "correlation-id-001", "2023-03-06T00:00:00Z", "2023-03-06T00:00:10Z", "test", "consumer-id-001", "merchant-global-id-001", "commercial-offer-id-001",
		)
		tx.MustExec(
			`INSERT INTO public.loan_status (loan_id, status, created_at) VALUES ($1, $2, $3)`,
			"b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "ACTIVE", "2023-03-06T00:00:00Z",
		)
		tx.MustExec(
			`INSERT INTO public.loan_schedule (id, loan_id, due_date, loan_balance, grace_period_end_date, due_principal, due_interest, due_late_fee, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			1, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "2023-04-05T23:59:59Z", 208000, "2023-04-07T23:59:59Z", 65699, 11301, 0, "2023-03-06T00:00:10Z", "test",
		)
		tx.MustExec(
			`INSERT INTO public.loan_schedule (id, loan_id, due_date, loan_balance, grace_period_end_date, due_principal, due_interest, due_late_fee, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			2, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "2023-05-05T23:59:59Z", 142301, "2023-05-07T23:59:59Z", 69269, 7731, 0, "2023-03-06T00:00:10Z", "test",
		)
		tx.MustExec(
			`INSERT INTO public.loan_schedule (id, loan_id, due_date, loan_balance, grace_period_end_date, due_principal, due_interest, due_late_fee, created_at, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			3, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "2023-06-05T23:59:59Z", 73032, "2023-06-07T23:59:59Z", 73032, 3968, 0, "2023-03-06T00:00:10Z", "test",
		)
		_ = tx.Commit()
		
		var loanCountInDb int
		var loanScheduleCountInDb int
		rows, _ := db.Queryx("SELECT COUNT(id) AS loan_count FROM public.loan")
		for rows.Next() {
			_ = rows.Scan(&loanCountInDb)
		}
		rows, _ = db.Queryx("SELECT COUNT(id) AS loan_schedule_count FROM public.loan_schedule WHERE loan_id = 'b35efe1d-0f5e-426b-bd3f-5acc4ea9861a'")
		for rows.Next() {
			_ = rows.Scan(&loanScheduleCountInDb)
		}
		
		if loanCountInDb != 1 || loanScheduleCountInDb != 3 {
			panic("failed to insert loan and loan schedule")
		}
	}
	
	insertMerchantTransactionSlip := func(db *sqlx.DB) {
		tx := db.MustBegin()
		tx.MustExec(
			`INSERT INTO public.merchant_transaction_slip
		    (id, loan_id, order_number, merchant_account_id, payable_units, payable_currency, booking_time, narration_comment, created_at) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8, $9)`,
			"1", "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "order-001", "merchant-global-id-001", 208000, "EUR", "2023-03-06T00:00:00Z", "disbursement slip", "2023-03-06T00:00:00Z",
		)
		
		_ = tx.Commit()
	}
	
	deactivatePartyAccount := func(db *sqlx.DB, partyId string) {
		_, err := db.Exec(fmt.Sprintf(`UPDATE public.party_account SET account_status = 'INACTIVE' WHERE global_reference_id = '%s'`, partyId))
		if err != nil {
			panic(err)
		}
	}
	
	getTransactionSlipIdByLoanId := func(db *sqlx.DB, loanId string) (string, error) {
		var transactionSlipId string
		err := db.QueryRowx("SELECT id FROM public.merchant_transaction_slip WHERE loan_id = $1", loanId).Scan(&transactionSlipId)
		if err != nil {
			return "", err
		}
		return transactionSlipId, nil
	}
	
	getJournalTransactionsByLoanId := func(db *sqlx.DB, loanId string) ([]map[string]interface{}, error) {
		rows, err := db.Queryx("SELECT * FROM public.journal WHERE loan_id = $1", loanId)
		if err != nil {
			return nil, err
		}
		
		data, err := libSql.ReadSqlRowsIntoAMap(rows)
		if err != nil {
			return nil, err
		}
		
		return data, nil
	}
	
	clearDatabase := func(db *sqlx.DB) {
		_, err := db.Exec(`DELETE FROM public.merchant_transaction_slip`)
		if err != nil {
			panic(err)
		}
		_, err = db.Exec(`DELETE FROM public.journal`)
		if err != nil {
			panic(err)
		}
		_, err = db.Exec(`DELETE FROM public.loan_schedule`)
		if err != nil {
			panic(err)
		}
		_, err = db.Exec(`DELETE FROM public.loan_status`)
		if err != nil {
			panic(err)
		}
		_, err = db.Exec(`DELETE FROM public.loan`)
		if err != nil {
			panic(err)
		}
		_, err = db.Exec(`DELETE FROM public.party_account`)
		if err != nil {
			panic(err)
		}
	}
	
	t.Run("cancel existing loan when consumer id does not even exist, should respond with error", func(t *testing.T) {
		clearDatabase(suite.dbConn)
		insertFinancialAccounts(suite.dbConn)
		insertExampleLoanAndSchedule(suite.dbConn)
		cancelLoanTask := libWorker.NewDecoratorTaskWorker(cancellation.NewCancelLoanTask(app), app.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"cancel_loan_details": map[string]interface{}{
				"reference_id":      "wf:cancel-loan-001",
				"loan_id":           "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"consumer_id":       "consumer-id-003",
				"merchant_id":       "merchant-global-id-001",
				"cancellation_time": "2023-03-10T00:00:00Z",
			},
		}
		taskResult, err := cancelLoanTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)
		assert.Equal(t, "servicing_usecase#CancelLoan - error loading consumer financial account: sql: no rows in result set", tr.ReasonForIncompletion)
		
		clearDatabase(suite.dbConn)
	})
	t.Run("cancel existing loan when consumer id exists but not active, should respond with error", func(t *testing.T) {
		clearDatabase(suite.dbConn)
		insertFinancialAccounts(suite.dbConn)
		insertExampleLoanAndSchedule(suite.dbConn)
		deactivatePartyAccount(suite.dbConn, "consumer-id-001")
		cancelLoanTask := libWorker.NewDecoratorTaskWorker(cancellation.NewCancelLoanTask(app), app.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"cancel_loan_details": map[string]interface{}{
				"reference_id":      "wf:cancel-loan-001",
				"loan_id":           "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"consumer_id":       "consumer-id-001",
				"merchant_id":       "merchant-global-id-001",
				"cancellation_time": "2023-03-10T00:00:00Z",
			},
		}
		taskResult, err := cancelLoanTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)
		assert.Equal(t, "servicing_usecase#CancelLoan - consumer account id: consumer-id-001 is not active", tr.ReasonForIncompletion)
		
		clearDatabase(suite.dbConn)
	})
	
	t.Run("cancel existing loan when merchant id does not even exist, should respond with error", func(t *testing.T) {
		clearDatabase(suite.dbConn)
		insertFinancialAccounts(suite.dbConn)
		insertExampleCommercialOffer(suite.dbConn)
		insertExampleLoanAndSchedule(suite.dbConn)
		cancelLoanTask := libWorker.NewDecoratorTaskWorker(cancellation.NewCancelLoanTask(app), app.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"cancel_loan_details": map[string]interface{}{
				"reference_id":      "wf:cancel-loan-001",
				"loan_id":           "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"consumer_id":       "consumer-id-001",
				"merchant_id":       "merchant-global-id-003",
				"cancellation_time": "2023-03-10T00:00:00Z",
			},
		}
		taskResult, err := cancelLoanTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)
		assert.Equal(t, "servicing_usecase#CancelLoan - error loading merchant financial account: sql: no rows in result set", tr.ReasonForIncompletion)
		
		clearDatabase(suite.dbConn)
	})
	t.Run("cancel existing loan when merchant id exists but not active, should allow to cancel the loan", func(t *testing.T) {
		clearDatabase(suite.dbConn)
		insertFinancialAccounts(suite.dbConn)
		insertExampleLoanAndSchedule(suite.dbConn)
		insertMerchantTransactionSlip(suite.dbConn)
		deactivatePartyAccount(suite.dbConn, "merchant-global-id-001")
		cancelLoanTask := libWorker.NewDecoratorTaskWorker(cancellation.NewCancelLoanTask(app), app.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"cancel_loan_details": map[string]interface{}{
				"reference_id":      "wf:cancel-loan-001",
				"loan_id":           "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"consumer_id":       "consumer-id-001",
				"merchant_id":       "merchant-global-id-001",
				"cancellation_time": "2023-03-10T00:00:00Z",
			},
		}
		taskResult, err := cancelLoanTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.Nil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.CompletedTask, tr.Status)
		
		sModule, err := suite.coreApp.GetModule(servicing.ServicingModuleName)
		assert.Nil(t, err)
		servicingModule := sModule.(*servicing.ServicingModule)
		
		// Get and assert loan exists
		loans, err := servicingModule.GetUseCase().GetAllLoansForConsumer(suite.ctx, "consumer-id-001")
		assert.Nil(t, err)
		assert.Equal(t, 1, len(loans))
		// Assert loan status
		loanCurrentStatus := loans[0].CurrentStatus()
		assert.Equal(t, domain.LoanStatusCancelled, loanCurrentStatus.StatusType())
		
		// Assert loan payment schedule
		loanPaymentSchedule := loans[0].PaymentSchedule()
		for _, paymentSchedule := range loanPaymentSchedule.LineItems() {
			assert.True(t, paymentSchedule.IsPaid())
		}
		
		// Assert merchant transaction slip status
		transactionSlipId, err := getTransactionSlipIdByLoanId(suite.dbConn, loans[0].Id())
		assert.Nil(t, err)
		assert.NotEmpty(t, transactionSlipId)
		gModule, err := suite.coreApp.GetModule(ga.GaModuleName)
		assert.Nil(t, err)
		gaModule := gModule.(*ga.GaModule)
		txSlip, err := gaModule.GetUseCase().GetTransactionDetails(suite.ctx, transactionSlipId)
		assert.Nil(t, err)
		assert.NotNil(t, txSlip)
		assert.True(t, txSlip.IsCancelledForDisbursement())
		
		// Assert journal entries
		journalTransactions, err := getJournalTransactionsByLoanId(suite.dbConn, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a")
		assert.Nil(t, err)
		assert.Equal(t, 11, len(journalTransactions))
		
		clearDatabase(suite.dbConn)
	})
}
