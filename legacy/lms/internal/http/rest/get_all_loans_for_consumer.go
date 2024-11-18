package rest

import (
	"github.com/btechlabs/lms-lite/pkg/uid"
	"net/http"
	
	"github.com/btechlabs/lms-lite/internal/http/domain"
	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/go-chi/chi/v5"
)

// GetAllLoansForConsumer
// @Summary Get all loans for a user
// @Description Get all loans for a consumer by consumer ID
// @ID get-all-loans-for-consumer
// @Produce json
// @Param consumerId path string true "Consumer ID"
// @Success 200 {object}  domain.GetAllLoansForConsumerResponse "Success"
// @Failure 400 {object}  domain.LmsHttpError "Bad Request"
// @Failure 500 {object}  domain.LmsHttpError "Internal Server Error"
// @Router /api/loans/consumer/{consumer_id} [get]
func GetAllLoansForConsumer(app app.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := logging.LogHandle.WithContext(r.Context())
		logger.Debugf("Request URL: %s", r.URL)
		consumerId := chi.URLParam(r, "consumer_id")
		logger.Debugf("Requested consumer id: %s", consumerId)
		
		if consumerId == "" {
			logger.Errorf("Consumer ID is mandatory for this request!")
			lmsError := domain.NewLmsHttpError("Consumer ID is mandatory for this request!", http.StatusBadRequest)
			domain.RespondWithError(w, lmsError)
			return
		}
		
		isValidUuid := uid.IsValidUUIDV4(consumerId)
		if !isValidUuid {
			logger.Infof("Consumer ID is not a valid UUID: %s, progressing to query anyway", consumerId)
		}
		
		module, err := app.GetModule(servicing.ServicingModuleName)
		if err != nil {
			logger.Errorf("Error loading servicing module with message:%v", err)
			lmsError := domain.NewLmsHttpError("Internal Server Error", http.StatusInternalServerError)
			domain.RespondWithError(w, lmsError)
			return
		}
		
		servicingModule := module.(*servicing.ServicingModule)
		useCase := servicingModule.GetUseCase()
		loans, err := useCase.GetAllLoansForConsumer(r.Context(), consumerId)
		if err != nil {
			logger.Errorf("Error during get all loans with message:%v", err)
			lmsError := domain.NewLmsHttpError("Internal Server Error", http.StatusInternalServerError)
			domain.RespondWithError(w, lmsError)
			return
		}
		
		loansData := domain.MapToConsumerLoanFromDomain(loans)
		domain.RespondWithSuccess(w, "loans listed successfully", loansData, http.StatusOK)
	}
}
