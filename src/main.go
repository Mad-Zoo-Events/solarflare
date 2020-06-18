package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// loads data from the database into the config
func load() {
	cfg := config.Get()

	cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
	cfg.DragonEffectPresets = client.GetDragonEffectPresets()
	cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
	cfg.Servers = []model.Server{
		model.Server{
			// Address: "http://3.133.229.78:8001", //hospital public
			Address: "http://172.31.41.5:8001", //hospital private
		},
	}
}

// writes the response header and a response body if supplied
func writeResponse(w http.ResponseWriter, code int, body []byte) {
	w.WriteHeader(code)

	if body != nil {
		w.Write(body)
	}
}

// returns an html page that immediately redirects the user to the endpoint specified
func redirectTo(w http.ResponseWriter, endpoint string) {
	w.WriteHeader(301)

	resp := "<html><head><meta http-equiv=\"Refresh\" content=\"0; url='" + endpoint + "'\" /></head></html>"

	w.Write([]byte(resp))
}

func main() {
	load()

	router := mux.NewRouter()

	// network status
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/status", StatusHandler()).Methods(http.MethodGet)

	// effect execution
	router.Handle("/presets/particle/{id}/{action}", EffectHandler(model.EffectTypeParticle)).Methods(http.MethodPost)
	router.Handle("/presets/dragon/{id}/{action}", EffectHandler(model.EffectTypeDragon)).Methods(http.MethodPost)
	router.Handle("/presets/timeshift/{id}/{action}", EffectHandler(model.EffectTypeTimeshift)).Methods(http.MethodPost)

	// preset management
	router.Handle("/presets/particle-ui", PresetMutationUIHandler(model.EffectTypeParticle)).Methods(http.MethodPost)
	router.Handle("/presets/dragon-ui", PresetMutationUIHandler(model.EffectTypeDragon)).Methods(http.MethodPost)
	router.Handle("/presets/timeshift-ui", PresetMutationUIHandler(model.EffectTypeTimeshift)).Methods(http.MethodPost)

	router.Handle("/presets/particle", PresetMutationHandler(model.EffectTypeParticle)).Methods(http.MethodPost)
	router.Handle("/presets/dragon", PresetMutationHandler(model.EffectTypeDragon)).Methods(http.MethodPost)
	router.Handle("/presets/timeshift", PresetMutationHandler(model.EffectTypeTimeshift)).Methods(http.MethodPost)

	router.Handle("/presets/particle/{id}", PresetDeletionHandler(model.EffectTypeParticle)).Methods(http.MethodDelete)
	router.Handle("/presets/dragon/{id}", PresetDeletionHandler(model.EffectTypeDragon)).Methods(http.MethodDelete)
	router.Handle("/presets/timeshift/{id}", PresetDeletionHandler(model.EffectTypeTimeshift)).Methods(http.MethodDelete)

	// web UI
	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))

	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets", CPPresetManagerHandler()).Methods(http.MethodGet)

	router.Handle("/controlpanel/presets/new/particle", CPPresetCreationHandler(model.EffectTypeParticle)).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/new/dragon", CPPresetCreationHandler(model.EffectTypeDragon)).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/new/timeshift", CPPresetCreationHandler(model.EffectTypeTimeshift)).Methods(http.MethodGet)

	router.Handle("/controlpanel/presets/modify/particle/{id}", CPPresetModificationHandler(model.EffectTypeParticle)).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/modify/dragon/{id}", CPPresetModificationHandler(model.EffectTypeDragon)).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/modify/timeshift/{id}", CPPresetModificationHandler(model.EffectTypeTimeshift)).Methods(http.MethodGet)

	log.Print("Starting server listening on port 5000")
	http.ListenAndServe(":5000", router)
}
