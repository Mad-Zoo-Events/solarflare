package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/controller"
)

// loads initial data from the database into the config
func load() {
	cfg := config.Get()

	cfg.Servers = client.GetServers(true)

	stageSetting, err := client.GetSetting(controller.StageSettingKey)
	if err == nil {
		cfg.SelectedStage = stageSetting.Value
	}

	client.ReloadAllPresets()
}

func main() {
	load()

	// router := mux.NewRouter()
	router := gin.Default()
	api := router.Group("/api")

	// service
	router.GET("/health", HealthHandler)
	router.GET("/version", VersionHandler)

	// settings
	settings := api.Group("/settings")
	settings.GET("/:setting", GetSettingsHandler)
	settings.POST("/:setting", SetSettingsHandler)
	api.PATCH("/servers/:id/:action", ServerHandler)

	// effect execution
	effects := api.Group("/effects")
	effects.POST("/run/:effectType/:id/:action", EffectHandler)
	effects.POST("/stopall", StopAllHandler)

	api.POST("/bossbar/:action", BossbarHandler)
	api.POST("/command", CommandHandler)

	// presets
	presets := api.Group("/presets")
	presets.POST("/:effectType", PresetMutationHandler)
	presets.DELETE("/:effectType/:id", PresetDeletionHandler)
	presets.POST("/:effectType/:id/duplicate", PresetDuplicationHandler)
	presets.GET("/:effectType", PreserRetrievalHandler)
	api.POST("/testPreset/:effectType", PresetTestHandler)

	// clock
	clock := api.Group("/clock")
	clock.POST("/restart", ClockRestartHandler)
	clock.POST("/speed", ClockSpeedHandler)
	clock.PUT("/:action", ClockSubscriptionHandler)

	// web UI
	router.Use(static.Serve("/controlpanel", static.LocalFile("./public", true)))
	router.Use(static.Serve("/presetmanager", static.LocalFile("./public", true)))

	// websocket
	api.GET("/socket", SocketHandler)

	log.Print("Starting server listening on port 5000")
	err := http.ListenAndServe(":5000", router)
	if err != nil {
		log.Println("Error during ListenAndServe: " + err.Error())
	}
}
