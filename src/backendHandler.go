package main

import (
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
)

// HealthHandler returns the health status of the service
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		resp := "¯\\_(ツ)_/¯"

		writeResponse(w, http.StatusOK, []byte(resp))
	}
}

// ToggleServerHandler handles requests to enable or disable a server
func ToggleServerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		var (
			id     = vars["id"]
			action = vars["action"]
		)

		controller.ToggleServer(id, model.ServerAction(action))

		writeResponse(w, http.StatusNoContent, nil)
	}
}

// SelectStageHandler handles requests to select a different data source for presets
func SelectStageHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		controller.SelectStage(vars["stage"])

		writeResponse(w, http.StatusNoContent, nil)
	}
}
