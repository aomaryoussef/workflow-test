package rest

import (
	"encoding/json"
	http_client "github.com/btechlabs/lms-lite/internal/clients/http"
	"github.com/btechlabs/lms-lite/pkg/app"
	"github.com/btechlabs/lms-lite/pkg/logging"
	"net/http"
)

// Health
// @Health
// @Summary get request to check service health
// @Description  get request to check service health
// @Produce      json
// @Success      200      {object}  HealthResponse
// @Failure      500      {string}  string         "fail"
// @Failure      408      {string}  string         "fail"
// @Router       /health [get]
func Health(app app.Application) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		response := &HealthResponse{}
		response.IsAlive = true
		response.Message = "OK"
		logging.LogHandle.WithContext(r.Context()).Info("Received request to check service health")
		config := app.EnvConfig()
		conductorClient := http_client.NewConductorHttpClient(config.Orkes.Url)
		healthResponse, err := conductorClient.GetConductorHealth(r.Context())
		if err != nil {
			logging.LogHandle.WithContext(r.Context()).Errorf("failed to get conductor response: %v", err)
			response.ConductorALive = false
		}
		if healthResponse != nil {
			response.ConductorALive = healthResponse.Healthy
		}
		dbConnection := app.GetConnectionManager()
		err = dbConnection.CheckDatabaseHealth()
		if err == nil {
			response.DatabaseALive = true
		}
		// Marshal the response to JSON
		jsonResponse, err := json.Marshal(response)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		
		// Set the content type to JSON
		w.Header().Set("Content-Type", "application/json")
		
		// Write the response to the http.ResponseWriter
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(jsonResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

type HealthResponse struct {
	IsAlive        bool   `json:"is_alive"`
	DatabaseALive  bool   `json:"database_alive"`
	ConductorALive bool   `json:"conductor_alive"`
	Message        string `json:"msg"`
}
