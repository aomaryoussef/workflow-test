package rest

import (
	"github.com/btechlabs/lms-lite/pkg/uid"
	"net/http"
	"strings"
	
	"github.com/btechlabs/lms-lite/internal/http/domain"
	"github.com/btechlabs/lms-lite/modules/servicing"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/go-chi/chi/v5"
)

// GetAllLoansForMerchant
// @Summary Get all loans for a user
// @Description Get all loans for a merchant by merchant ID
// @ID get-all-loans-for-merchant
// @Produce json
// @Param merchantId path string true "Merchant ID"
// @Success 200 {object}  domain.GetAllLoansForMerchantResponse "Success"
// @Failure 400 {object}  domain.LmsHttpError "Bad Request"
// @Failure 500 {object}  domain.LmsHttpError "Internal Server Error"
// @Router /api/loans/merchant/{merchant_id} [get]
func GetAllLoansForMerchant(app app.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		logger := logging.LogHandle.WithContext(r.Context())
		logger.Debugf("Request URL: %s", r.URL)
		merchantId := chi.URLParam(r, "merchant_id")
		logger.Debugf("Requested merchant id: %s", merchantId)
		
		if merchantId == "" {
			logger.Errorf("Partner ID is mandatory for this request!")
			lmsError := domain.NewLmsHttpError("Partner ID is mandatory for this request!", http.StatusBadRequest)
			domain.RespondWithError(w, lmsError)
			return
		}
		
		isValidUuid := uid.IsValidUUIDV4(merchantId)
		if !isValidUuid {
			logger.Infof("Partner ID is not a valid UUID: %s, progressing to query anyway", merchantId)
		}
		
		loanIds := strings.Split(r.URL.Query().Get("loans"), ",")
		for _, val := range loanIds {
			if val != "" && !uid.IsValidUUIDV4(val) {
				lmsError := domain.NewLmsHttpError("Invalid Loan ID", http.StatusBadRequest)
				domain.RespondWithError(w, lmsError)
				return
			}
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
		loans, err := useCase.GetAllLoansForMerchant(r.Context(), merchantId, loanIds)
		if err != nil {
			logger.Errorf("Error during get all_loan with message:%v", err)
			lmsError := domain.NewLmsHttpError("Internal Server Error", http.StatusInternalServerError)
			domain.RespondWithError(w, lmsError)
			return
		}
		loansData := domain.MapToMerchantLoanFromDomain(loans)
		domain.RespondWithSuccess(w, "loans listed successfully", loansData, http.StatusOK)
	}
}
