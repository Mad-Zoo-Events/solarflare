package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
)

// HealthHandler returns the health status of the service
func HealthHandler(c *gin.Context) {
	c.String(http.StatusOK, "¯\\_(ツ)_/¯")
}

// VersionHandler returns the current version of the backend
func VersionHandler(c *gin.Context) {
	c.String(http.StatusOK, config.Get().AppVersion)
}

// ToggleServerHandler handles requests to enable or disable a server
func ToggleServerHandler(c *gin.Context) {
	controller.ToggleServer(c.Param("id"), model.ServerAction(c.Param("action")))

	c.Status(http.StatusNoContent)
}

// SelectStageHandler handles requests to select a different data source for presets
func SelectStageHandler(c *gin.Context) {
	controller.SelectStage(c.Param("stage"))

	c.Status(http.StatusNoContent)
}
