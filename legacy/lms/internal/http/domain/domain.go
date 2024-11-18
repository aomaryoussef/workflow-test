package domain

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"github.com/btechlabs/lms-lite/pkg/money"
	"net/http"
)

type LmsHttpError struct {
	Message string `json:"message"`
	Code    int    `json:"code"`
}

func NewLmsHttpError(message string, code int) *LmsHttpError {
	return &LmsHttpError{
		Message: message,
		Code:    code,
	}
}

func (e *LmsHttpError) Error() string {
	return fmt.Sprintf("AppError: %s (Code: %d)", e.Message, e.Code)
}

func RespondWithError(w http.ResponseWriter, err *LmsHttpError) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(err.Code)

	response := map[string]string{"error": err.Message}
	encodeError := json.NewEncoder(w).Encode(response)
	if encodeError != nil {
		logging.LogHandle.WithContext(context.Background()).Errorf("failed to encode response :%v", err)
	}

}

type LmsResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Code    int         `json:"code,omitempty"`
}

func NewSuccessResponse(message string, data interface{}, code int) *LmsResponse {
	return &LmsResponse{
		Success: true,
		Message: message,
		Data:    data,
		Code:    code,
	}
}

func RespondWithSuccess(w http.ResponseWriter, message string, data interface{}, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Length", "-1")
	response := NewSuccessResponse(message, data, code)
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		logging.LogHandle.WithContext(context.Background()).Errorf("failed to write response :%v", err)
	}
}

type Money struct {
	Currency string `json:"currency"`
	Amount   uint64 `json:"amount"`
}

func MapFromDomainMoney(money *money.Money) *Money {
	return &Money{
		Currency: money.Currency().Code,
		Amount:   money.Units(),
	}
}
