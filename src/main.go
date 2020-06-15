package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

func load() {
	cfg := config.Get()

	cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
	cfg.DragonEffectPresets = client.GetDragonEffectPresets()
	cfg.Servers = []model.Server{}
}

func main() {
	load()

	router := mux.NewRouter()

	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)

	// network status
	router.Handle("/status", StatusHandler()).Methods(http.MethodGet)

	// preset execution
	router.Handle("/presets/{id}/{action}", PresetExecutionHandler()).Methods(http.MethodPost)

	// preset management
	router.Handle("/presets/particle", PresetMutationHandler(model.EffectTypeParticleEffect)).Methods(http.MethodPost)
	router.Handle("/presets/dragon", PresetMutationHandler(model.EffectTypeDragon)).Methods(http.MethodPost)
	router.Handle("/presets/particle/{id}", PresetDeletionHandler(model.EffectTypeParticleEffect)).Methods(http.MethodDelete)
	router.Handle("/presets/dragon/{id}", PresetDeletionHandler(model.EffectTypeDragon)).Methods(http.MethodDelete)

	// web UI
	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets", ControlPanelPresetHandler()).Methods(http.MethodGet)

	log.Print("Starting server listening on port 5000")
	http.ListenAndServe(":5000", router)
}
