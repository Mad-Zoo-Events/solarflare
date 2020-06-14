package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	router := mux.NewRouter()

	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)

	router.Handle("/status", StatusHandler()).Methods(http.MethodGet)

	router.Handle("/effects/dragon", DragonHandler()).Methods(http.MethodPost)
	router.Handle("/effects/particle", ParticleEffectHandler()).Methods(http.MethodPost)

	log.Print("Starting server listening on port 5000")
	http.ListenAndServe(":5000", router)
}
