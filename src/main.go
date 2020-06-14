package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/status", StatusHandler()).Methods(http.MethodGet)
	router.Handle("/effects/{id}/{action}", EffectHandler()).Methods(http.MethodPost)

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)

	log.Print("Starting server listening on port 5000")
	http.ListenAndServe(":5000", router)
}
