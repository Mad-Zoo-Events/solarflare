package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/clock"
)

// loads data from the database into the config
func load() {
	cfg := config.Get()

	cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
	cfg.DragonEffectPresets = client.GetDragonEffectPresets()
	cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
	cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
	cfg.PotionEffectPresets = client.GetPotionEffectPresets()
	cfg.Servers = []model.Server{
		model.Server{
			// Address: "http://3.133.229.78:8001", //hospital public
			Address: "http://172.31.41.5:8001", //hospital private
		},
	}

	clock.Start(128, 1)
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
	router.Handle("/effects/{effectType}/{id}/{action}", EffectHandler()).Methods(http.MethodPost)

	// preset management
	router.Handle("/presets/{effectType}-ui", PresetMutationUIHandler()).Methods(http.MethodPost)
	router.Handle("/presets/{effectType}", PresetMutationHandler()).Methods(http.MethodPost)
	router.Handle("/presets/{effectType}/{id}", PresetDeletionHandler()).Methods(http.MethodDelete)

	// clock
	router.Handle("/clock/sync", ClockSyncHandler()).Methods(http.MethodGet)
	router.Handle("/clock/restart", ClockRestartHandler()).Methods(http.MethodPost)
	router.Handle("/clock/{bpm}/{multiplier}", ClockSpeedHandler()).Methods(http.MethodPut)
	router.Handle("/clock/{effectType}/{id}", ClockSubscriptionHandler(model.SubscribeClockAction)).Methods(http.MethodPost)
	router.Handle("/clock/{effectType}/{id}", ClockSubscriptionHandler(model.UnsubscribeClockAction)).Methods(http.MethodDelete)

	// web UI
	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))

	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets", CPPresetManagerHandler()).Methods(http.MethodGet)

	router.Handle("/controlpanel/presets/{effectType}/new", CPPresetHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/{effectType}/modify/{id}", CPPresetHandler()).Methods(http.MethodGet)

	log.Print("Starting server listening on port 5000")
	http.ListenAndServe(":5000", router)
}
