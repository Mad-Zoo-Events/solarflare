package main

import (
	"encoding/json"
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// HealthHandler returns the health status of the service
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		resp := "¯\\_(ツ)_/¯"

		writeResponse(w, 200, []byte(resp))
	}
}

// StatusHandler returns status information about the server network
func StatusHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		status := controller.GetStatus()

		resp, err := json.Marshal(status)
		if err != nil {
			err = sferror.New(sferror.Encoding, "Failed to marshal status response", err)
			writeResponse(w, 500, sferror.GetErrorResponse(err))
			return
		}

		writeResponse(w, 200, resp)
	}
}

// ReloadServerListHandler handles requests to reload the server list
func ReloadServerListHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		controller.ReloadServerList()

		writeResponse(w, 204, nil)
	}
}
