package main

import (
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
)

// HealthHandler returns the health status of the service
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		resp := "¯\\_(ツ)_/¯"

		writeResponse(w, 200, []byte(resp))
	}
}

// ReloadServerListHandler handles requests to reload the server list
func ReloadServerListHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		controller.ReloadServerList()

		writeResponse(w, 204, nil)
	}
}
