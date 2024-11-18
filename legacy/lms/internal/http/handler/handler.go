package handler

import (
	"net/http"

	"github.com/btechlabs/lms-lite/internal/http/rest"
	"github.com/btechlabs/lms-lite/internal/middleware"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/go-chi/chi/v5"
)

func Handler(application app.Application) http.Handler {
	router := chi.NewRouter()
	router.Use(middleware.Recovery)
	router.Use(middleware.TraceHeaders)
	router.Get("/health", rest.Health(application))
	router.Get("/api/loans/consumer/{consumer_id}", rest.GetAllLoansForConsumer(application))
	router.Get("/api/loans/merchant/{merchant_id}", rest.GetAllLoansForMerchant(application))
	router.Get("/api/loans/merchant/transaction/{transaction_id}", rest.GetTransactionDetails(application))
	return router
}
