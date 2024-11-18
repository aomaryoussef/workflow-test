package rest

import (
	"github.com/btechlabs/lms-lite/internal/http/domain"
	"github.com/btechlabs/lms-lite/modules/ga"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/uid"
	"github.com/go-chi/chi/v5"
	"net/http"
)

func GetTransactionDetails(app app.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := logging.LogHandle.WithContext(r.Context())
		transactionId := chi.URLParam(r, "transaction_id")
		isValidUuid := uid.IsValidUUIDV4(transactionId)
		if !isValidUuid {
			logger.Errorf("Invalid Transaction ID: %s", transactionId)
			lmsError := domain.NewLmsHttpError("Invalid Transaction ID", http.StatusBadRequest)
			domain.RespondWithError(w, lmsError)
			return
		}
		module, err := app.GetModule(ga.GaModuleName)
		if err != nil {
			logger.Errorf("Error loading servicing module with message:%v", err)
			lmsError := domain.NewLmsHttpError("Internal Server Error", http.StatusInternalServerError)
			domain.RespondWithError(w, lmsError)
			return
		}
		
		gaModule := module.(*ga.GaModule)
		useCase := gaModule.GetUseCase()
		transactionDetails, err := useCase.GetTransactionDetails(r.Context(), transactionId)
		if err != nil {
			logger.Errorf("Error during get transaction details with message:%v", err)
			lmsError := domain.NewLmsHttpError("Internal Server Error", http.StatusInternalServerError)
			domain.RespondWithError(w, lmsError)
			return
		}
		transactionSlip := domain.MapFromDomainToTransactionDetailsResponse(transactionDetails)
		domain.RespondWithSuccess(w, "transaction details retrieved successfully", transactionSlip, http.StatusOK)
	}
}
