package workers

import (
	"testing"
	"time"

	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/pkg/sql"
	libWorker "github.com/btechlabs/lms-lite/pkg/worker"
	"github.com/btechlabs/lms-lite/workers/collection"
	"github.com/conductor-sdk/conductor-go/sdk/model"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/assert"
)

func insertExampleLoanAndSchedule(db *sqlx.DB) {
	clearDatabase(db)
	tx := db.MustBegin()
	tx.MustExec(
		`INSERT INTO public.loan (id, financial_product_key, financial_product_version, correlation_id, booked_at, created_at, created_by, consumer_id, merchant_global_id, commercial_offer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		"b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", "financial-product-key-001", "financial-product-version-001", "correlation-id-001", "2023-03-06T00:00:00Z", "2023-03-06T00:00:10Z", "test", "consumer-id-001", "merchant-global-id-001", "commercial-offer-id-001",
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

func fetchLoanScheduleTable(db *sqlx.DB) []map[string]interface{} {
	rows, _ := db.Queryx("SELECT * FROM public.loan_schedule ORDER BY id ASC")
	loanSchedules, err := sql.ReadSqlRowsIntoAMap(rows)
	if err != nil {
		panic(err)
	}
	return loanSchedules
}

func fetchJournalTable(db *sqlx.DB) []map[string]interface{} {
	rows, _ := db.Queryx("SELECT * FROM public.journal ORDER BY id ASC")
	journals, err := sql.ReadSqlRowsIntoAMap(rows)
	if err != nil {
		panic(err)
	}
	return journals
}

func clearDatabase(db *sqlx.DB) {
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

func (suite *WorkersIntegrationTestSuite) TestBookConsumerCollectionLmsTask() {
	t := suite.T()
	app := suite.coreApp

	baseTask := model.Task{
		TaskDefName: "book_consumer_collection",
		TaskId:      "book_consumer_collection",
		TaskDefinition: &model.TaskDef{
			Name: "book_consumer_collection",
		},
		WorkflowType: "workflow-type-001",
		WorkflowTask: &model.WorkflowTask{
			Name:              "book_consumer_collection",
			TaskReferenceName: "book_consumer_collection",
		},
		WorkerId:           "inst-001fgutc",
		WorkflowInstanceId: "workflow-id-001",
		CorrelationId:      "correlation-id-001",
		InputData:          make(map[string]interface{}),
	}
	// when servicing module is not injected in app (tech case) -> expect error
	// t.Run("when no servicing module is injected in app (tech case) -> expect error", func(t *testing.T) {
	// 	insertExampleLoanAndSchedule(suite.dbConn)
	// 	suite.coreApp = app.DisableModule(servicing.ServicingModuleName)
	// 	bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	// 	task := baseTask
	// 	task.InputData = map[string]interface{}{
	// 		"payment_details": map[string]interface{}{
	// 			"id":                          "REGISTRY001ID",
	// 			"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
	// 			"billing_account_schedule_id": 1,
	// 			"booking_time":                "2023-04-04T12:43:23Z",
	// 			"amount_units":                77000,
	// 			"amount_currency":             "EGP",
	// 			"raw_request": map[string]interface{}{
	// 				"payment_method_code": "MLW-CASH",
	// 			},
	// 		},
	// 	}
	// 	taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
	// 	tr := taskResult.(*model.TaskResult)
	// 	assert.NotNil(t, err)
	// 	assert.NotNil(t, tr)
	// 	assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)
	// 	assert.Equal(t, "servicing module not loaded in the application", tr.ReasonForIncompletion)
	// 	assert.Equal(t, "servicing module not loaded in the application, ask development team to ensure code check on application if servicing module is being unregistered", tr.Logs[0].Log)

	// 	clearDatabase(suite.dbConn)
	// })

	// when task is called multiple times with same task input -> expect idempotent result
	// t.Run("when task is called multiple times with same task input -> expect idempotent result", func(t *testing.T) {
	// 	insertExampleLoanAndSchedule(suite.dbConn)
	// 	suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
	// 	bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
	// 	task := baseTask
	// 	task.InputData = map[string]interface{}{
	// 		"payment_details": map[string]interface{}{
	// 			"id":                          "REGISTRY001ID",
	// 			"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
	// 			"billing_account_schedule_id": 1,
	// 			"booking_time":                "2023-04-04T12:43:23Z",
	// 			"amount_units":                77000,
	// 			"amount_currency":             "EGP",
	// 			"raw_request": map[string]interface{}{
	// 				"payment_method_code": "MLW-CASH",
	// 			},
	// 		},
	// 	}

	// 	taskResult1, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
	// 	tr1 := taskResult1.(*model.TaskResult)
	// 	assert.Nil(t, err)
	// 	assert.NotNil(t, tr1)
	// 	assert.Equal(t, model.CompletedTask, tr1.Status)
	// 	taskResult2, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
	// 	tr2 := taskResult2.(*model.TaskResult)
	// 	assert.Nil(t, err)
	// 	assert.NotNil(t, tr2)
	// 	assert.Equal(t, model.CompletedTask, tr2.Status)

	// 	// assert the loan schedule table
	// 	loanSchedules := fetchLoanScheduleTable(suite.dbConn)
	// 	assert.Len(t, loanSchedules, 3)

	// 	firstSchedule := loanSchedules[0]
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", firstSchedule["loan_id"])
	// 	assert.Equal(t, time.Date(2023, time.March, 6, 00, 00, 10, 0, time.UTC), firstSchedule["created_at"])
	// 	assert.Equal(t, time.Date(2023, time.April, 5, 23, 59, 59, 0, time.UTC), firstSchedule["due_date"])
	// 	assert.Equal(t, time.Date(2023, time.April, 7, 23, 59, 59, 0, time.UTC), firstSchedule["grace_period_end_date"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), firstSchedule["paid_date"])
	// 	assert.Equal(t, int64(208000), firstSchedule["loan_balance"])
	// 	assert.Equal(t, int64(65699), firstSchedule["due_principal"])
	// 	assert.Equal(t, int64(11301), firstSchedule["due_interest"])
	// 	assert.Equal(t, int64(0), firstSchedule["due_late_fee"])
	// 	assert.Equal(t, "test", firstSchedule["created_by"])
	// 	assert.Equal(t, int64(65699), firstSchedule["paid_principal"])
	// 	assert.Equal(t, int64(11301), firstSchedule["paid_interest"])
	// 	assert.Equal(t, int64(0), firstSchedule["paid_late_fee"])
	// 	assert.Equal(t, "REGISTRY001ID", firstSchedule["id"])
	// 	assert.Equal(t, "wf:workflow-id-001", firstSchedule["updated_by"])

	// 	secondSchedule := loanSchedules[1]
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", secondSchedule["loan_id"])
	// 	assert.Equal(t, time.Date(2023, time.March, 6, 00, 00, 10, 0, time.UTC), secondSchedule["created_at"])
	// 	assert.Equal(t, time.Date(2023, time.May, 5, 23, 59, 59, 0, time.UTC), secondSchedule["due_date"])
	// 	assert.Equal(t, time.Date(2023, time.May, 7, 23, 59, 59, 0, time.UTC), secondSchedule["grace_period_end_date"])
	// 	assert.Nil(t, secondSchedule["paid_date"])
	// 	assert.Nil(t, secondSchedule["updated_at"])
	// 	assert.Nil(t, secondSchedule["updated_by"])
	// 	assert.Equal(t, int64(142301), secondSchedule["loan_balance"])
	// 	assert.Equal(t, int64(69269), secondSchedule["due_principal"])
	// 	assert.Equal(t, int64(7731), secondSchedule["due_interest"])
	// 	assert.Equal(t, int64(0), secondSchedule["due_late_fee"])
	// 	assert.Equal(t, "test", secondSchedule["created_by"])
	// 	assert.Nil(t, secondSchedule["paid_principal"])
	// 	assert.Nil(t, secondSchedule["paid_interest"])
	// 	assert.Nil(t, secondSchedule["paid_late_fee"])

	// 	thirdSchedule := loanSchedules[2]
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", thirdSchedule["loan_id"])
	// 	assert.Equal(t, time.Date(2023, time.March, 6, 00, 00, 10, 0, time.UTC), thirdSchedule["created_at"])
	// 	assert.Equal(t, time.Date(2023, time.June, 5, 23, 59, 59, 0, time.UTC), thirdSchedule["due_date"])
	// 	assert.Equal(t, time.Date(2023, time.June, 7, 23, 59, 59, 0, time.UTC), thirdSchedule["grace_period_end_date"])
	// 	assert.Nil(t, thirdSchedule["paid_date"])
	// 	assert.Nil(t, thirdSchedule["updated_at"])
	// 	assert.Nil(t, thirdSchedule["updated_by"])
	// 	assert.Equal(t, int64(73032), thirdSchedule["loan_balance"])
	// 	assert.Equal(t, int64(73032), thirdSchedule["due_principal"])
	// 	assert.Equal(t, int64(3968), thirdSchedule["due_interest"])
	// 	assert.Equal(t, int64(0), thirdSchedule["due_late_fee"])
	// 	assert.Equal(t, "test", thirdSchedule["created_by"])
	// 	assert.Nil(t, thirdSchedule["paid_principal"])
	// 	assert.Nil(t, thirdSchedule["paid_interest"])
	// 	assert.Nil(t, thirdSchedule["paid_late_fee"])

	// 	// assert the journal table
	// 	journals := fetchJournalTable(suite.dbConn)
	// 	assert.Len(t, journals, 5)

	// 	debitBtechCollections := journals[0]
	// 	assert.Equal(t, "REGISTRY001ID", debitBtechCollections["correlation_id"])
	// 	assert.Equal(t, "BtechCollections", debitBtechCollections["account"])
	// 	assert.Equal(t, []byte("DEBIT"), debitBtechCollections["direction"])
	// 	assert.Equal(t, int64(77000), debitBtechCollections["amount"])
	// 	assert.Equal(t, "wf:workflow-id-001", debitBtechCollections["created_by"])
	// 	assert.Equal(t, int64(1), debitBtechCollections["transaction_id"])
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", debitBtechCollections["loan_id"])
	// 	assert.Equal(t, "COLLECTION", debitBtechCollections["type"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), debitBtechCollections["booked_at"])

	// 	creditCustomerCollection := journals[1]
	// 	assert.Equal(t, "REGISTRY001ID", creditCustomerCollection["correlation_id"])
	// 	assert.Equal(t, "CustomerCollections", creditCustomerCollection["account"])
	// 	assert.Equal(t, []byte("CREDIT"), creditCustomerCollection["direction"])
	// 	assert.Equal(t, int64(77000), creditCustomerCollection["amount"])
	// 	assert.Equal(t, "wf:workflow-id-001", creditCustomerCollection["created_by"])
	// 	assert.Equal(t, int64(1), creditCustomerCollection["transaction_id"])
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", creditCustomerCollection["loan_id"])
	// 	assert.Equal(t, "COLLECTION", creditCustomerCollection["type"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), debitBtechCollections["booked_at"])

	// 	debitCustomerCollection := journals[2]
	// 	assert.Equal(t, "REGISTRY001ID", debitCustomerCollection["correlation_id"])
	// 	assert.Equal(t, "CustomerCollections", debitCustomerCollection["account"])
	// 	assert.Equal(t, []byte("DEBIT"), debitCustomerCollection["direction"])
	// 	assert.Equal(t, int64(77000), debitCustomerCollection["amount"])
	// 	assert.Equal(t, "wf:workflow-id-001", debitCustomerCollection["created_by"])
	// 	assert.Equal(t, int64(2), debitCustomerCollection["transaction_id"])
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", debitCustomerCollection["loan_id"])
	// 	assert.Equal(t, "COLLECTION", debitCustomerCollection["type"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), debitBtechCollections["booked_at"])

	// 	murabahaPrincipalReceivable := journals[3]
	// 	assert.Equal(t, "REGISTRY001ID", murabahaPrincipalReceivable["correlation_id"])
	// 	assert.Equal(t, "MurabhaPrincipalReceivable", murabahaPrincipalReceivable["account"])
	// 	assert.Equal(t, []byte("CREDIT"), murabahaPrincipalReceivable["direction"])
	// 	assert.Equal(t, int64(65699), murabahaPrincipalReceivable["amount"])
	// 	assert.Equal(t, "wf:workflow-id-001", murabahaPrincipalReceivable["created_by"])
	// 	assert.Equal(t, int64(2), murabahaPrincipalReceivable["transaction_id"])
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", murabahaPrincipalReceivable["loan_id"])
	// 	assert.Equal(t, "COLLECTION", murabahaPrincipalReceivable["type"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), murabahaPrincipalReceivable["booked_at"])

	// 	murabahaInterestReceivable := journals[4]
	// 	assert.Equal(t, "REGISTRY001ID", murabahaInterestReceivable["correlation_id"])
	// 	assert.Equal(t, "MurabhaInterestReceivable", murabahaInterestReceivable["account"])
	// 	assert.Equal(t, []byte("CREDIT"), murabahaInterestReceivable["direction"])
	// 	assert.Equal(t, int64(11301), murabahaInterestReceivable["amount"])
	// 	assert.Equal(t, "wf:workflow-id-001", murabahaInterestReceivable["created_by"])
	// 	assert.Equal(t, int64(2), murabahaInterestReceivable["transaction_id"])
	// 	assert.Equal(t, "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a", murabahaInterestReceivable["loan_id"])
	// 	assert.Equal(t, "COLLECTION", murabahaInterestReceivable["type"])
	// 	assert.Equal(t, time.Date(2023, time.April, 4, 12, 43, 23, 0, time.UTC), murabahaPrincipalReceivable["booked_at"])

	// 	clearDatabase(suite.dbConn)
	// })

	// when task is called multiple times with same task input but different ref ID -> expect error
	t.Run("when task is called multiple times with same task input but different id -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"billing_account_schedule_id": 1,
				"booking_time":                "2023-04-04T12:43:23Z",
				"amount_units":                77000,
				"amount_currency":             "EGP",
				"id":                          "REGISTRY001ID",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}

		task.InputData["payment_details"].(map[string]interface{})["id"] = "REGISTRY001ID"
		taskResult1, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		tr1 := taskResult1.(*model.TaskResult)
		assert.Nil(t, err)
		assert.NotNil(t, tr1)
		assert.Equal(t, model.CompletedTask, tr1.Status)

		task.InputData["payment_details"].(map[string]interface{})["id"] = "registry-id-002"
		taskResult2, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		tr2 := taskResult2.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr2)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr2.Status)

		clearDatabase(suite.dbConn)
	})

	// when task is called with more money than due -> expect error
	t.Run("when task is called with more money than due -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"id":                          "REGISTRY001ID",
				"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"billing_account_schedule_id": 1,
				"booking_time":                "2023-04-04T12:43:23Z",
				"amount_units":                77001,
				"amount_currency":             "EGP",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}

		taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)

		clearDatabase(suite.dbConn)
	})

	// when task is called with less money than due -> expect error
	t.Run("when task is called with less money than due -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"id":                          "REGISTRY001ID",
				"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"billing_account_schedule_id": 1,
				"booking_time":                "2023-04-04T12:43:23Z",
				"amount_units":                76999,
				"amount_currency":             "EGP",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}

		taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		tr := taskResult.(*model.TaskResult)
		assert.NotNil(t, err)
		assert.NotNil(t, tr)
		assert.Equal(t, model.FailedWithTerminalErrorTask, tr.Status)

		clearDatabase(suite.dbConn)
	})

	// when task is called with invalid loan id -> expect error
	t.Run("when task is called with invalid loan id -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"id":                          "REGISTRY001ID",
				"billing_account":             "non-existent-loan",
				"billing_account_schedule_id": 1,
				"booking_time":                "2023-04-04T12:43:23Z",
				"amount_units":                76999,
				"amount_currency":             "EGP",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}
		taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		assert.NotNil(t, err)
		assert.NotNil(t, taskResult)
		clearDatabase(suite.dbConn)
	})

	// when task is called with invalid loan schedule id -> expect error
	t.Run("when task is called with invalid loan schedule id -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"id":                          "REGISTRY001ID",
				"billing_account":             "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"billing_account_schedule_id": 10,
				"booking_time":                "2023-04-04T12:43:23Z",
				"amount_units":                76999,
				"amount_currency":             "EGP",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}
		taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		assert.NotNil(t, err)
		assert.NotNil(t, taskResult)
		clearDatabase(suite.dbConn)
	})

	// when task is called with booking time in future -> expect error
	t.Run("when task is called with booking time in future -> expect error", func(t *testing.T) {
		insertExampleLoanAndSchedule(suite.dbConn)
		suite.coreApp = app.EnableModule(servicing.ServicingModuleName)
		bookConsumerCollectionTask := libWorker.NewDecoratorTaskWorker(collection.NewBookConsumerCollectionLmsTask(suite.coreApp), suite.coreApp.GetConnectionManager())
		task := baseTask
		task.InputData = map[string]interface{}{
			"payment_details": map[string]interface{}{
				"registry_id":                 "b35efe1d-0f5e-426b-bd3f-5acc4ea9861a",
				"billing_account":             "non-existent-loan",
				"billing_account_schedule_id": 1,
				"booking_time":                time.Now().UTC().Add(time.Hour * 24),
				"amount_units":                76999,
				"amount_currency":             "EGP",
				"raw_request": map[string]interface{}{
					"payment_method_code": "MLW-CASH",
				},
			},
		}
		taskResult, err := bookConsumerCollectionTask.GetTaskFunction()(&task)
		assert.NotNil(t, err)
		assert.NotNil(t, taskResult)
		clearDatabase(suite.dbConn)
	})
}
