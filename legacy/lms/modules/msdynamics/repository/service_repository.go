package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	gaDto "github.com/btechlabs/lms-lite/modules/ga/dto"
	"github.com/btechlabs/lms-lite/modules/msdynamics/dto"
	"github.com/btechlabs/lms-lite/pkg/utils"
	"github.com/samber/lo"

	accounts "github.com/btechlabs/lms-lite/internal/accounting"
	httpclient "github.com/btechlabs/lms-lite/internal/clients/http"
	"github.com/btechlabs/lms-lite/modules/msdynamics/domain"
	"github.com/btechlabs/lms-lite/pkg/logging"
	libSql "github.com/btechlabs/lms-lite/pkg/sql"
)

const (
	createMerchantUrl        = "services/BT_Mylo_ServiceGroup/BT_Mylo_CreateMerchantService/CreateMerchants"
	createMerchantInvoiceUrl = "services/BT_Mylo_ServiceGroup/BT_Mylo_CreateMerchantInvoiceService/CreateMerchantInvoice"
	submitGeneralLedgerUrl   = "services/BT_Mylo_ServiceGroup/BT_Mylo_SubmitToGeneralLedgerService/SubmitToGeneralLedger"
)

var _ MSDynamicsRepository = (*MSDynamicsServiceRepository)(nil)

type MSDynamicsServiceRepository struct {
	client httpclient.MSDynamicsClient
	CoAMap *ChartOfAccountsMap
	pg     libSql.PgConnectionManager
}

const (
	emptyString               = ""
	dynamicsResponseSucceeded = "Succeeded"
)

func NewMSDynamicsServiceRepository(coaMap *ChartOfAccountsMap, client httpclient.MSDynamicsClient, pg libSql.PgConnectionManager) *MSDynamicsServiceRepository {
	return &MSDynamicsServiceRepository{client: client, CoAMap: coaMap, pg: pg}
}

func (r *MSDynamicsServiceRepository) OpenMerchantAccount(ctx context.Context, tracingId string, account *domain.MerchantAccount) (*domain.MerchantAccount, error) {
	logger := logging.LogHandle.WithContext(ctx)

	metaData := &httpclient.MetaData{
		DataAreaId:        "OL",
		IntegrationPoint:  "Create Merchant",
		MyloRequestNumber: tracingId,
	}
	data := &httpclient.CommonMerchantData{
		MerchantAccount:           account.Id(),
		MerchantName:              account.Name(),
		MerchantGroup:             account.Group(),
		CurrencyCode:              account.CurrencyCode(),
		SearchName:                account.SearchName(),
		SalesTaxGroup:             account.SalesTaxGroup(),
		WithholdingTaxGroupCode:   account.WithholdingTaxGroupCode(),
		Location:                  account.Location(),
		StreetNumber:              account.StreetNumber(),
		Street:                    account.Street(),
		ZipCode:                   account.ZipCode(),
		State:                     account.State(),
		City:                      account.City(),
		MerchantBankName:          account.MerchantBankName(),
		MerchantBankAddress:       account.MerchantBankAddress(),
		MerchantBankBranchName:    account.MerchantBankBranchName(),
		MerchantBankSwiftCode:     account.MerchantBankSwiftCode(),
		MerchantBankIBAN:          account.MerchantBankIBAN(),
		MerchantBankAccountNumber: account.MerchantBankAccountNumber(),
		TaxRegistrationNumber:     account.TaxRegistrationNumber(),
		BeneficiaryBankName:       account.BeneficiaryBankName(),
		BeneficiaryBankAddress:    account.BeneficiaryBankAddress(),
	}
	request := &httpclient.CreateMerchantRequest{
		Contract: httpclient.CreateMerchantContract{
			MetaData: metaData,
			MerchantDataList: []httpclient.MerchantDataRequest{
				{
					CommonMerchantData: data,
				},
			},
		},
	}

	logger.Infof("msdynamics_service_repository#OpenMerchantAccount - request JSON:\n%s", utils.PrettyPrintJSON(request))

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#OpenMerchantAccount - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, createMerchantUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	createMerchantResponse := &httpclient.CreateMerchantResponse{}
	err = json.Unmarshal(responseBodyBytes, createMerchantResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#OpenMerchantAccount - error unmarshalling response body: %v", err)
		return nil, err
	}

	if len(createMerchantResponse.MerchantDataList) != 1 {
		err = fmt.Errorf("msdynamics_service_repository#OpenMerchantAccount -  response contains data about multiple merchants when it must be 1, size = %d", len(createMerchantResponse.MerchantDataList))
		return nil, err
	}

	if createMerchantResponse.MerchantDataList[0].ResponseStatus != "Succeeded" {
		err = fmt.Errorf("msdynamics_service_repository#OpenMerchantAccount -  response does not contain status as Succeeded but current value = %s with reason %s",
			createMerchantResponse.MerchantDataList[0].ResponseStatus, createMerchantResponse.MerchantDataList[0].ResponseDescription)
		return nil, err
	}

	builder := domain.NewMerchantAccountBuilder()
	builder.Id = createMerchantResponse.ID
	builder.GlobalId = account.GlobalId()
	savedAccount := builder.Build()

	return &savedAccount, nil
}

func (r *MSDynamicsServiceRepository) NewMerchantInvoices(ctx context.Context, tracingId string, invoices []*domain.MerchantInvoice) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	metaData := &httpclient.MetaData{
		DataAreaId:        "OL",
		IntegrationPoint:  "Due",
		MyloRequestNumber: tracingId,
	}
	request := &httpclient.CreateMerchantInvoiceRequest{
		Contract: httpclient.InvoiceContract{
			MetaData: metaData,
		},
	}
	for _, i := range invoices {
		invoiceDate, err := time.Parse(time.RFC3339, i.InvoiceDate())
		if err != nil {
			logger.Errorf("msdynamics_service_repository#NewMerchantInvoices - error parsing invoice date: %s will continue without TransDate", err.Error())
		}
		line := httpclient.InvoiceGeneralJournalRequest{
			Account: i.AccountId(),
			GeneralJournalLines: []httpclient.InvoiceGeneralJournalLineRequest{
				{
					CurrencyCode:  i.CurrencyCode(),
					InvoiceId:     i.InvoiceId(),
					OffsetAccount: i.OffsetAccount(),
					InvoiceDate:   i.InvoiceDate(),
					Amount:        i.Amount(),
					Description:   i.Description(),
					TransDate:     fmt.Sprintf("/Date(%d)/", invoiceDate.UTC().UnixMilli()),
				},
			},
		}

		request.Contract.GeneralJournals = append(request.Contract.GeneralJournals, line)
	}

	logger.Infof("msdynamics_service_repository#NewMerchantInvoices - request JSON:\n%s", utils.PrettyPrintJSON(request))

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#NewMerchantInvoices - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, createMerchantInvoiceUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	createMerchantInvoiceResponse := &httpclient.CreateMerchantInvoiceResponse{}
	err = json.Unmarshal(responseBodyBytes, createMerchantInvoiceResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#OpenMerchantAccount - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if createMerchantInvoiceResponse.GeneralJournals != nil && len(createMerchantInvoiceResponse.GeneralJournals) > 0 {

		failedGeneralJournal := lo.Filter(createMerchantInvoiceResponse.GeneralJournals, func(item httpclient.InvoiceGeneralJournalResponse, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#NewMerchantInvoices - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#NewMerchantInvoices - response does not contain GeneralJournals")
}

func (r *MSDynamicsServiceRepository) GetChartofAccountsMap() *ChartOfAccountsMap {
	// We have this here because in the future we might want to load
	// the chart of accounts from the database
	return r.CoAMap
}

func (r *MSDynamicsServiceRepository) SaveGeneralJournalEntries(ctx context.Context, tracingId string, journals []*domain.GeneralJournal) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	metaData := &httpclient.MetaData{
		DataAreaId:        "OL", // TODO: make it configuration so can be switched (company name inside MS Dynamics)
		MyloRequestNumber: tracingId,
	}
	request := httpclient.SubmitToGeneralLedgerRequest{
		Contract: httpclient.GeneralLedgerContract{
			MetaData: metaData,
		},
	}
	for _, j := range journals {
		journal := httpclient.GeneralJournalItemRequest{
			JournalName:          j.JournalName(),
			MyloJournalReference: tracingId,
			MyloTransType:        j.TransactionType(),
			TransDate:            j.TransactionDate(),
		}
		for _, jl := range j.Entries() {
			journalLine := httpclient.GeneralJournalItemLineRequest{
				Account:     jl.Account(),
				Type:        jl.Direction(),
				Amount:      jl.Amount(),
				Description: jl.Description(),
			}
			journal.JournalLines = append(journal.JournalLines, journalLine)
		}
		request.Contract.GeneralJournalList = append(request.Contract.GeneralJournalList, journal)
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#NewMerchantInvoices - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	submitToGeneralLedgerResponse := &httpclient.SubmitToGeneralLedgerResponse{}
	err = json.Unmarshal(responseBodyBytes, submitToGeneralLedgerResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#SaveGeneralJournalEntries - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if submitToGeneralLedgerResponse.GeneralJournalList != nil && len(submitToGeneralLedgerResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(submitToGeneralLedgerResponse.GeneralJournalList, func(item httpclient.GeneralJournalItemResponse, _ int) bool {
			return item.ResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#SaveGeneralJournalEntries - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#SaveGeneralJournalEntries - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) BookConsumerCollectionMyloTreasuryFawryChannel(ctx context.Context, input domain.ConsumerCollectionFawryChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	extractLastDigitsOfYear := func(t time.Time) string {
		return t.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	transformToJournal := func(input domain.ConsumerCollectionFawryChannel, direction string, account string) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  input.PaidAmountUnits,
			Description:             emptyString,
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 emptyString,
			PaymentMethod:           emptyString,
			CardNumber:              emptyString,
			Comment:                 fmt.Sprintf("loan: %s, payment_reference: %s", input.BillingAccount, input.PaymentReferenceId),
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.PaymentReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 emptyString,
					JournalName:               fmt.Sprintf("Coll%s", extractLastDigitsOfYear(input.BookingTime)),
					JournalNumber:             emptyString,
					MyloJournalReference:      input.PaymentReferenceId,
					MyloTransType:             "Collection",
					TransDate:                 transformToDynamicsDateFmt(input.BookingTime),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						// the account numbers are hard coded in the code because they DO NOT CHANGE
						// if they change, we will have to change the code and the chart of accounts
						// no one changes these without ensuring from the finance team and
						// dynamics / general accounting team
						transformToJournal(input, "Debit", accounts.BTTDPaymentPayableAccount),
						transformToJournal(input, "Credit", "120301035"),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryFawryChannel - error marshalling payload: %v", err)
		return nil, err
	}

	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookConsumerCollectionResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookConsumerCollectionResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryFawryChannel - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookConsumerCollectionResponse.GeneralJournalList != nil && len(bookConsumerCollectionResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookConsumerCollectionResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryFawryChannel - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionMyloTreasury - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) BookConsumerCollectionMyloTreasuryBTechStoreChannel(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	extractLastDigitsOfYear := func(t time.Time) string {
		return t.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	transformToJournal := func(input domain.ConsumerCollectionBTechStoreChannel, direction string, account string) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  input.PaidAmountUnits,
			Description:             emptyString,
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 input.CollectionStoreId,
			PaymentMethod:           emptyString,
			CardNumber:              emptyString,
			Comment:                 fmt.Sprintf("loan: %s, payment_reference: %s", input.BillingAccount, input.PaymentReferenceId),
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.PaymentReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 input.CollectedBy,
					JournalName:               fmt.Sprintf("Coll%s", extractLastDigitsOfYear(input.BookingTime)),
					JournalNumber:             emptyString,
					MyloJournalReference:      input.PaymentReferenceId,
					MyloTransType:             "Collection",
					TransDate:                 transformToDynamicsDateFmt(input.BookingTime),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						// the account numbers are hard coded in the code because they DO NOT CHANGE
						// if they change, we will have to change the code and the chart of accounts
						// no one changes these without ensuring from the finance team and
						// dynamics / general accounting team
						transformToJournal(input, "Debit", accounts.BTTDPaymentPayableAccount),
						transformToJournal(input, "Credit", "120301035"),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryBTechStoreChannel - error marshalling payload: %v", err)
		return nil, err
	}

	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookConsumerCollectionResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookConsumerCollectionResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryBTechStoreChannel - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookConsumerCollectionResponse.GeneralJournalList != nil && len(bookConsumerCollectionResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookConsumerCollectionResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryBTechStoreChannel - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionMyloTreasuryBTechStoreChannel - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) BookConsumerCollectionBTechTreasury(ctx context.Context, input domain.ConsumerCollectionBTechStoreChannel) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	extractLastDigitsOfYear := func(t time.Time) string {
		return t.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	transformToJournal := func(input domain.ConsumerCollectionBTechStoreChannel, direction string, account string) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  input.PaidAmountUnits,
			Description:             emptyString,
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 input.CollectionStoreId,
			PaymentMethod:           input.PaymentMethod,
			CardNumber:              emptyString,
			Comment:                 fmt.Sprintf("loan: %s, payment_reference: %s, payment_method: %s", input.BillingAccount, input.PaymentReferenceId, input.PaymentMethod),
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "BTTD",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.PaymentReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 input.CollectedBy,
					JournalName:               fmt.Sprintf("RIO%s", extractLastDigitsOfYear(input.BookingTime)),
					JournalNumber:             emptyString,
					MyloJournalReference:      input.PaymentReferenceId,
					MyloTransType:             "Collection Transaction - BTTD",
					TransDate:                 transformToDynamicsDateFmt(input.BookingTime),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						// the account numbers are hard coded in the code because they DO NOT CHANGE
						// if they change, we will have to change the code and the chart of accounts
						// no one changes these without ensuring from the finance team and
						// dynamics / general accounting team
						transformToJournal(input, "Credit", accounts.MyloDueAccount),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookConsumerCollectionResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookConsumerCollectionResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookConsumerCollectionResponse.GeneralJournalList != nil && len(bookConsumerCollectionResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookConsumerCollectionResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) BookCollectionMyloTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	extractLastDigitsOfYear := func(t time.Time) string {
		// Load the Cairo timezone location
		location, err := time.LoadLocation("Africa/Cairo")
		if err != nil {
			return ""
		}
		// Convert the time to Cairo local time
		cairoTime := t.In(location)
		// Format and extract the last two digits of the year
		return cairoTime.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	// set parameters based on the collection method
	storeId := ""
	debitAccount := ""
	collectedBy := ""
	paymentMethod := ""
	cardNumber, ok := input.Metadata["card_number"].(string)
	if !ok {
		cardNumber = ""
	}
	cardReferenceNumber, ok := input.Metadata["reference_number"].(string)
	if !ok {
		cardReferenceNumber = ""
	}
	if input.CollectionMethod == domain.BTECH_STORE_CASH || input.CollectionMethod == domain.BTECH_STORE_POS {
		storeId = input.Metadata["collection_store_id"].(string)
		collectedBy = input.Metadata["collected_by"].(string)
		paymentMethod = input.Metadata["payment_method_code"].(string)
		debitAccount = accounts.BTTDPaymentPayableAccount
	} else if input.CollectionMethod == domain.FAWRY {
		debitAccount = accounts.FawryPaymentReceivableAccount
		collectedBy = "fawry"
	}

	transformToJournal := func(input domain.ConsumerCollectionToTreasury, direction string, account string) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  input.PaidAmountUnits,
			Description:             string(input.CollectionMethod),
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 storeId,
			PaymentMethod:           paymentMethod,
			CardNumber:              cardNumber,
			CardReferenceNumber:     cardReferenceNumber,
			Comment:                 fmt.Sprintf("payment_reference: %s", input.PaymentReferenceId),
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.PaymentReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 collectedBy,
					JournalName:               fmt.Sprintf("Coll%s", extractLastDigitsOfYear(input.BookingTime)),
					JournalNumber:             emptyString,
					MyloJournalReference:      input.PaymentReferenceId,
					MyloTransType:             "Collection",
					TransDate:                 transformToDynamicsDateFmt(input.BookingTime),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						transformToJournal(input, "Debit", debitAccount),
						transformToJournal(input, "Credit", accounts.ConsumerPaymentReceivableAccount),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookCollectionMyloTreasury - error marshalling payload: %v", err)
		return nil, err
	}

	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookConsumerCollectionResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookConsumerCollectionResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookCollectionMyloTreasury - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookConsumerCollectionResponse.GeneralJournalList != nil && len(bookConsumerCollectionResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookConsumerCollectionResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 && bookConsumerCollectionResponse.GeneralJournalList[0].HeaderResponseDescription != "This request number already exist before..." {
			return dynamics, errors.New("msdynamics_service_repository#BookCollectionMyloTreasury - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#BookCollectionMyloTreasury - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) BookCollectionBTechTreasury(ctx context.Context, input domain.ConsumerCollectionToTreasury) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)
	extractLastDigitsOfYear := func(t time.Time) string {
		// Load the Cairo timezone location
		location, err := time.LoadLocation("Africa/Cairo")
		if err != nil {
			return ""
		}
		// Convert the time to Cairo local time
		cairoTime := t.In(location)
		// Format and extract the last two digits of the year
		return cairoTime.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	storeId := input.Metadata["collection_store_id"].(string)
	collectedBy := input.Metadata["collected_by"].(string)
	paymentMethodCode := input.Metadata["payment_method_code"].(string)
	cardNumber, ok := input.Metadata["card_number"].(string)
	if !ok {
		cardNumber = ""
	}
	cardReferenceNumber, ok := input.Metadata["reference_number"].(string)
	if !ok {
		cardReferenceNumber = ""
	}

	transformToJournal := func(input domain.ConsumerCollectionToTreasury, direction string, account string) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  input.PaidAmountUnits,
			Description:             string(input.CollectionMethod),
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 storeId,
			PaymentMethod:           paymentMethodCode,
			CardNumber:              cardNumber,
			CardReferenceNumber:     cardReferenceNumber,
			Comment:                 fmt.Sprintf("payment_reference: %s, payment_method: %s", input.PaymentReferenceId, paymentMethodCode),
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "BTTD",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.PaymentReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 collectedBy,
					JournalName:               fmt.Sprintf("RIO%s", extractLastDigitsOfYear(input.BookingTime)),
					JournalNumber:             emptyString,
					MyloJournalReference:      input.PaymentReferenceId,
					MyloTransType:             "Collection Transaction - BTTD",
					TransDate:                 transformToDynamicsDateFmt(input.BookingTime),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						transformToJournal(input, "Credit", accounts.MyloDueAccount),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookConsumerCollectionResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookConsumerCollectionResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookConsumerCollectionResponse.GeneralJournalList != nil && len(bookConsumerCollectionResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookConsumerCollectionResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 && bookConsumerCollectionResponse.GeneralJournalList[0].HeaderResponseDescription != "This request number already exist before..." {
			return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) PostAggregatedCollectionsAtEndOfDay(ctx context.Context, input dto.PostAggregatedCollectionRequest) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	endTimeUTC, err := input.DateTimeRange.EndTimeUTCAsTime()
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error marshalling end_time_given as time: %s - %v", input.DateTimeRange.EndTimeGiven, err)
		return nil, err
	}

	extractLastDigitsOfYear := func(t time.Time) string {
		return t.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	transformToJournal := func(input dto.PostAggregatedCollectionRequest, direction string, account string, amount uint64) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  amount,
			Description:             emptyString,
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 emptyString,
			PaymentMethod:           emptyString,
			CardNumber:              emptyString,
			Comment:                 emptyString,
		}
		return
	}

	request := httpclient.BookCollectionTreasuryRequest{
		Contract: httpclient.BookCollectionTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.ReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					EnteredBy:                 fmt.Sprintf("wf:%s", input.ReferenceId),
					// We take the end time given to extract the year for the JournalName
					// Do not use the UTC time because in local time
					// e.g. 01.01.2025 01:00:00 is still 31.12.2024 23:00:00 in local time
					JournalName:          fmt.Sprintf("Coll%s", extractLastDigitsOfYear(endTimeUTC)),
					JournalNumber:        emptyString,
					MyloJournalReference: input.ReferenceId,
					MyloTransType:        "Collection",
					TransDate:            transformToDynamicsDateFmt(endTimeUTC),
					JournalLines: []httpclient.CollectionGeneralJournalLine{
						// the account numbers are hard coded in the code because they DO NOT CHANGE
						// if they change, we will have to change the code and the chart of accounts
						// no one changes these without ensuring from the finance team and
						// dynamics / general accounting team

						// Regular Collections
						transformToJournal(input, "Debit", "120301035", input.AccountPosition.RegularCollection.DebitCustomerCollection),
						transformToJournal(input, "Credit", "120301033", input.AccountPosition.RegularCollection.CreditMurabahaPrincipalReceivables),
						transformToJournal(input, "Credit", "120301034", input.AccountPosition.RegularCollection.CreditMurabahaInterestReceivables),
						// Early Settlements
						transformToJournal(input, "Debit", "120301035", input.AccountPosition.EarlySettlementCollection.DebitCustomerCollection),
						transformToJournal(input, "Debit", "120301040", input.AccountPosition.EarlySettlementCollection.DebitMurabahaSettlementAllowance),
						transformToJournal(input, "Credit", "120301033", input.AccountPosition.EarlySettlementCollection.CreditMurabahaPrincipalReceivables),
						transformToJournal(input, "Credit", "120301034", input.AccountPosition.EarlySettlementCollection.CreditMurabahaInterestReceivables),
						// Revenue loss
						transformToJournal(input, "Debit", "230406005", input.AccountPosition.EarlySettlementRevenueLoss.DebitUnearnedRevenue),
						transformToJournal(input, "Credit", "120301040", input.AccountPosition.EarlySettlementRevenueLoss.CreditMurabahaSettlementAllowance),
						transformToJournal(input, "Credit", "410201001", input.AccountPosition.EarlySettlementRevenueLoss.CreditInterestRevenue),
					},
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#BookConsumerCollectionBTechTreasury - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookTreasuryResponse := &httpclient.BookCollectionTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookTreasuryResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#PostAggregatedCollectionsAtEndOfDay - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookTreasuryResponse.GeneralJournalList != nil && len(bookTreasuryResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookTreasuryResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#PostAggregatedCollectionsAtEndOfDay - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#PostAggregatedCollectionsAtEndOfDay - response does not contain GeneralJournalList")
}

// PostAggregatedLoanCancellationsAtEndOfDay posts aggregated loan cancellations at the end of the day
// See specification details: https://btechlabs.atlassian.net/wiki/x/BQCOI
func (r *MSDynamicsServiceRepository) PostAggregatedLoanCancellationsAtEndOfDay(ctx context.Context, input PostAggregatedLoanCancellationRequest) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	extractLastDigitsOfYear := func(t time.Time) string {
		return t.Format("2006")[2:]
	}
	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}
	transformToJournal := func(direction string, account string, accountDescription string, amount int64) (data httpclient.CollectionGeneralJournalLine) {
		data = httpclient.CollectionGeneralJournalLine{
			Account:                 account,
			AccountType:             emptyString,
			Amount:                  uint64(amount), // Wrong usage but for now we are using it as every amount is positive
			Description:             accountDescription,
			LineResponseDescription: emptyString,
			LineResponseStatus:      emptyString,
			Type:                    direction,
			StoreId:                 emptyString,
			PaymentMethod:           emptyString,
			CardNumber:              emptyString,
			Comment:                 emptyString,
		}
		return
	}

	mapReduce := func(records []AggregatedMerchantLoanCancellationRecord, fnReturnsValueToAdd func(item AggregatedMerchantLoanCancellationRecord) int64) int64 {
		return lo.Reduce(
			records,
			func(aggregatedSum int64, item AggregatedMerchantLoanCancellationRecord, _ int) int64 {
				return aggregatedSum + fnReturnsValueToAdd(item)
			},
			0,
		)
	}

	// Before we start, we need to explain the following:
	// lo.Reduce is a function that is used to reduce a list of items to a single value
	// which means iterate through the list and apply a function to each item (which in this case is a sum)

	loanActivationJournalLines := make([]httpclient.CollectionGeneralJournalLine, 0)
	// the account numbers are hard coded in the code because they DO NOT CHANGE
	// if they change, we will have to change the code and the chart of accounts
	// no one changes these without ensuring from the finance team and
	// dynamics / general accounting team
	loanActivationJournalLines = append(
		loanActivationJournalLines,
		transformToJournal(
			"Debit",
			"120101006",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.MurabhaPurchaseDebit },
			),
		),
		transformToJournal(
			"Credit",
			"120301033",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 {
					return item.MurabhaPrincipalReceivableCredit
				},
			),
		),
		transformToJournal(
			"Credit",
			"120301034",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.MurabhaUnearnedRevenueDebit },
			),
		),
		transformToJournal(
			"Debit",
			"230406005",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.MurabhaInterestReceivableCredit },
			),
		),
		transformToJournal(
			"Debit",
			"120403007",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.DoubtfulAllowanceDebit },
			),
		),
		transformToJournal(
			"Credit",
			"510501017",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.DoubtfulAllowanceCredit },
			),
		),
	)

	adminFeesJournalLines := make([]httpclient.CollectionGeneralJournalLine, 0)
	// the account numbers are hard coded in the code because they DO NOT CHANGE
	// if they change, we will have to change the code and the chart of accounts
	// no one changes these without ensuring from the finance team and
	// dynamics / general accounting team
	adminFeesJournalLines = append(
		adminFeesJournalLines,
		transformToJournal(
			"Debit",
			"410101006",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.AdminFeeDebit },
			),
		),
		transformToJournal(
			"Debit",
			"230408002",
			"Value added Tax",
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.TaxDueDebit },
			),
		),
	)
	for _, item := range input.AggregatedMerchantLoanCancellationRecords {
		adminFeesJournalLines = append(
			adminFeesJournalLines,
			transformToJournal(
				"Credit",
				fmt.Sprintf("230202012|%s|MISC", utils.GenerateDynamicsMerchantID(item.MerchantId)),
				emptyString,
				item.MerchantDueCredit,
			),
		)
	}

	purchaseJournalLines := make([]httpclient.CollectionGeneralJournalLine, 0)
	// the account numbers are hard coded in the code because they DO NOT CHANGE
	// if they change, we will have to change the code and the chart of accounts
	// no one changes these without ensuring from the finance team and
	// dynamics / general accounting team
	purchaseJournalLines = append(
		purchaseJournalLines,
		transformToJournal(
			"Credit",
			"120101006",
			emptyString,
			mapReduce(
				input.AggregatedMerchantLoanCancellationRecords,
				func(item AggregatedMerchantLoanCancellationRecord) int64 { return item.MurabhaPurchaseCredit },
			),
		),
	)
	for _, item := range input.AggregatedMerchantLoanCancellationRecords {
		purchaseJournalLines = append(
			purchaseJournalLines,
			transformToJournal(
				"Debit",
				fmt.Sprintf("230202012|%s|MISC", utils.GenerateDynamicsMerchantID(item.MerchantId)),
				emptyString,
				item.MerchantDueDebit,
			),
		)
	}

	request := httpclient.BookLoanCancellationTreasuryRequest{
		Contract: httpclient.BookLoanCancellationTreasuryContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  emptyString,
				MyloRequestNumber: input.ReferenceId,
			},
			GeneralJournalList: []httpclient.CollectionGeneralJournal{
				{
					EnteredBy:                 emptyString,
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					// We take the end time given to extract the year for the JournalName
					// Do not use the UTC time because in local time
					// e.g. 01.01.2025 01:00:00 is still 31.12.2024 23:00:00 in local time
					JournalName:          fmt.Sprintf("RACT%s", extractLastDigitsOfYear(input.EndTimeUTC)),
					JournalNumber:        emptyString,
					MyloJournalReference: input.ReferenceId,
					MyloTransType:        "Loan activation",
					TransDate:            transformToDynamicsDateFmt(input.EndTimeUTC),
					JournalLines:         loanActivationJournalLines,
				},
				{
					EnteredBy:                 emptyString,
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					// We take the end time given to extract the year for the JournalName
					// Do not use the UTC time because in local time
					// e.g. 01.01.2025 01:00:00 is still 31.12.2024 23:00:00 in local time
					JournalName:          fmt.Sprintf("RAD%s", extractLastDigitsOfYear(input.EndTimeUTC)),
					JournalNumber:        emptyString,
					MyloJournalReference: input.ReferenceId,
					MyloTransType:        "Admin Fees",
					TransDate:            transformToDynamicsDateFmt(input.EndTimeUTC),
					JournalLines:         adminFeesJournalLines,
				},
				{
					EnteredBy:                 emptyString,
					HeaderResponseStatus:      emptyString,
					HeaderResponseDescription: emptyString,
					// We take the end time given to extract the year for the JournalName
					// Do not use the UTC time because in local time
					// e.g. 01.01.2025 01:00:00 is still 31.12.2024 23:00:00 in local time
					JournalName:          fmt.Sprintf("RPR%s", extractLastDigitsOfYear(input.EndTimeUTC)),
					JournalNumber:        emptyString,
					MyloJournalReference: input.ReferenceId,
					MyloTransType:        "Purchase",
					TransDate:            transformToDynamicsDateFmt(input.EndTimeUTC),
					JournalLines:         purchaseJournalLines,
				},
			},
		},
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#PostAggregatedLoanCancellationsAtEndOfDay - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookLoanCancellationAggregationResponse := &httpclient.BookLoanCancellationTreasuryResponse{}
	err = json.Unmarshal(responseBodyBytes, bookLoanCancellationAggregationResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#PostAggregatedLoanCancellationsAtEndOfDay - error unmarshalling response body: %v", err)
		return nil, err
	}

	// This in fact is a crazy way due to 1 reason:
	// 1. The Dynamics APIs do not follow the regular / standard way (to be fixed during stabilisation)
	// For now we are assuming that this is exactly the response
	if bookLoanCancellationAggregationResponse.GeneralJournalList != nil && len(bookLoanCancellationAggregationResponse.GeneralJournalList) > 0 {

		failedGeneralJournal := lo.Filter(bookLoanCancellationAggregationResponse.GeneralJournalList, func(item httpclient.CollectionGeneralJournal, _ int) bool {
			return item.HeaderResponseStatus != dynamicsResponseSucceeded
		})
		if len(failedGeneralJournal) > 0 {
			return dynamics, errors.New("msdynamics_service_repository#PostAggregatedLoanCancellationsAtEndOfDay - failed status from dynamics, see logs")
		} else {
			return dynamics, nil
		}
	}

	return dynamics, errors.New("msdynamics_service_repository#PostAggregatedLoanCancellationsAtEndOfDay - response does not contain GeneralJournalList")
}

func (r *MSDynamicsServiceRepository) PostCancelledInvoicesAccount(ctx context.Context, input gaDto.CancelledMerchantDisbursements) (dynamics *dto.DynamicsRequestResponse, err error) {
	logger := logging.LogHandle.WithContext(ctx)

	transformToDynamicsDateFmt := func(t time.Time) string {
		return fmt.Sprintf("/Date(%d)/", t.UnixMilli())
	}

	request := httpclient.BookCancelledInvoicesAccountRequest{
		Contract: httpclient.BookCancelledInvoicesAccountContract{
			MetaData: &httpclient.MetaData{
				DataAreaId:        "OL",
				IntegrationPoint:  "Due",
				MyloRequestNumber: input.ReferenceId,
			},
			MerchantInvoices: make([]httpclient.MerchantInvoice, 0),
		},
	}

	timeNowSeconds := time.Now().Unix()

	for i, record := range input.CancelledMerchantDisbursementRecords {
		dynamicsMerchantId := utils.GenerateDynamicsMerchantID(int(record.MerchantAccountId))
		request.Contract.MerchantInvoices = append(request.Contract.MerchantInvoices, httpclient.MerchantInvoice{
			Account:                   dynamicsMerchantId,
			HeaderResponseDescription: emptyString,
			HeaderResponseStatus:      emptyString,
			JournalNumber:             emptyString,
			MerchantInvoiceLines: []httpclient.MerchantInvoiceLine{
				{
					Amount:                  -1 * int64(record.PayableUnits),
					CurrencyCode:            "EGP",
					Description:             fmt.Sprintf("Invoice of merchant %s for", dynamicsMerchantId),
					InvoiceDate:             transformToDynamicsDateFmt(input.EndTime.UTC()),
					InvoiceId:               fmt.Sprintf("RINV-%d", timeNowSeconds+int64(i)),
					LineResponseDescription: emptyString,
					LineResponseStatus:      emptyString,
					OffsetAccount:           fmt.Sprintf("230202012|%s|MISC", dynamicsMerchantId),
					TransDate:               transformToDynamicsDateFmt(input.EndTime.UTC()),
				},
			},
		})
	}

	requestBodyBytes, err := json.Marshal(request)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#PostCancelledInvoicesAccount - error marshalling payload: %v", err)
		return nil, err
	}
	responseBodyBytes, err := r.client.MakeRequest(ctx, submitGeneralLedgerUrl, requestBodyBytes)
	if err != nil {
		// we do not log any error and let it slide up to the caller
		// this keeps our logs clean and only logs the error once: easy to debug
		return nil, err
	}

	dynamics = &dto.DynamicsRequestResponse{}
	dynamics.Url = submitGeneralLedgerUrl
	dynamics.RequestBodyJson = requestBodyBytes
	dynamics.ResponseBodyJson = responseBodyBytes

	bookMerchantInvoiceCancellationResponse := make(map[string]interface{})
	err = json.Unmarshal(responseBodyBytes, &bookMerchantInvoiceCancellationResponse)
	if err != nil {
		logger.Errorf("msdynamics_service_repository#PostCancelledInvoicesAccount - error unmarshalling response body: %v", err)
		return nil, err
	}

	return dynamics, nil
}
