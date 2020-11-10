package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
)

// loads data from the database into the config
func load() {
	cfg := config.Get()

	if !cfg.RunningOnDev {
		gin.SetMode(gin.ReleaseMode)
	}

	cfg.Servers = client.GetServers()

	cfg.Stages = []string{"mzitv", "stratos", "iod"}
	cfg.SelectedStage = cfg.Stages[2]

	client.ReloadAllPresets()
}

// writes the response header and a response body if supplied
func writeResponse(w http.ResponseWriter, code int, body []byte) {
	w.WriteHeader(code)

	if body != nil {
		w.Write(body)
	}
}

func redirectTo(w http.ResponseWriter, r *http.Request, endpoint string) {
	http.Redirect(w, r, endpoint, http.StatusFound)
}

func main() {
	load()

	// router := mux.NewRouter()
	router := gin.Default()

	// network / service
	router.GET("/health", HealthHandler)
	router.PATCH("/servers/:id/:action", ToggleServerHandler)
	router.POST("/selectstage/:stage", SelectStageHandler)

	// effect execution
	effects := router.Group("/effects")
	effects.POST("/run/:effectType/:id/:action", EffectHandler)
	effects.POST("/stopall", StopAllHandler)

	router.POST("/bossbar/:action", BossbarHandler)
	router.POST("/command", CommandHandler)

	// preset management
	presetForm := router.Group("/presetform")
	presetForm.POST("/:effectType", PresetFormHandler)
	presetForm.POST("/:effectType/test", PresetFormTestTestHandler)

	presets := router.Group("/presets")
	presets.POST("/:effectType", PresetMutationHandler)
	presets.DELETE("/:effectType/:id", PresetDeletionHandler)
	presets.POST("/:effectType/:id/duplicate", PresetDuplicationHandler)

	// clock
	clock := router.Group("/clock")
	clock.GET("/sync", ClockSyncHandler)
	clock.POST("/restart", ClockRestartHandler)
	clock.POST("/speed", ClockSpeedHandler)
	clock.PUT("/:action", ClockSubscriptionHandler)

	// web UI
	// router.Use(static.Serve("/controlpanel", static.LocalFile("./static/", true)))
	staticDir := "/static/"
	// router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Use(static.Serve(staticDir, static.LocalFile("."+staticDir, true)))

	router.GET("/controlpanel", ControlPanelHandler)
	router.GET("/controlpanel/presets", CPPresetManagerHandler)

	router.GET("/controlpanel/presets/:effectType/new", CPPresetHandler)
	router.GET("/controlpanel/presets/:effectType/modify/:id", CPPresetHandler)

	// websocket
	router.GET("/socket", SocketHandler)

	log.Print("Starting server listening on port 5000")
	err := http.ListenAndServe(":5000", router)
	if err != nil {
		log.Println("Error during ListenAndServe: " + err.Error())
	}
}
