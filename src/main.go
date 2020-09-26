package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
)

// loads data from the database into the config
func load() {
	cfg := config.Get()

	cfg.Servers = client.GetServers()

	cfg.Stages = []string{"mzitv", "stratos"}
	cfg.SelectedStage = cfg.Stages[1]

	client.ReloadAllPresets()

	env := os.Getenv("ENVIRONMENT")
	if env == "dev" {
		cfg.RunningOnDev = true
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

	// network / service
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/servers/{id}/{action}", ToggleServerHandler()).Methods(http.MethodPatch)
	router.Handle("/selectstage/{stage}", SelectStageHandler()).Methods(http.MethodPost)

	// effect execution
	router.Handle("/effects/{effectType}/{id}/{action}", EffectHandler()).Methods(http.MethodPost)
	router.Handle("/bossbar/{action}", BossbarHandler()).Methods(http.MethodPost)

	// preset management
	router.Handle("/presets/{effectType}-ui", PresetMutationUIHandler()).Methods(http.MethodPost)
	router.Handle("/presets/{effectType}", PresetMutationHandler()).Methods(http.MethodPost)
	router.Handle("/presets/{effectType}/{id}", PresetDeletionHandler()).Methods(http.MethodDelete)

	// clock
	router.Handle("/clock/sync", ClockSyncHandler()).Methods(http.MethodGet)
	router.Handle("/clock/restart", ClockRestartHandler()).Methods(http.MethodPost)
	router.Handle("/clock/{bpm}/{multiplier}", ClockSpeedHandler()).Methods(http.MethodPut)
	router.Handle("/clock/{action}/{effectType}/{id}", ClockSubscriptionHandler()).Methods(http.MethodPost)

	// web UI
	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))

	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets", CPPresetManagerHandler()).Methods(http.MethodGet)

	router.Handle("/controlpanel/presets/{effectType}/new", CPPresetHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel/presets/{effectType}/modify/{id}", CPPresetHandler()).Methods(http.MethodGet)

	// websocket
	router.Handle("/socket", SocketHandler())

	log.Print("Starting server listening on port 5000")
	err := http.ListenAndServe(":5000", router)
	if err != nil {
		log.Println("Error during ListenAndServe: " + err.Error())
	}
}
