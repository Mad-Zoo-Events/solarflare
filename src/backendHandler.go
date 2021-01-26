package main

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
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

// StartStopInstanceHandler handles requests to enable or disable a server
func StartStopInstanceHandler(c *gin.Context) {
	controller.StartStopInstance(model.InstanceAction(c.Param("action")))

	c.Status(http.StatusNoContent)
}

// SelectStageHandler handles requests to select a different data source for presets
func SelectStageHandler(c *gin.Context) {
	controller.SelectStage(c.Param("stage"))

	c.Status(http.StatusNoContent)
}

// SetSettingsHandler handles requests to set user settings
func SetSettingsHandler(c *gin.Context) {
	body, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		err = sferror.New(sferror.Encoding, "Error reading setting request body", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	if err := controller.SetSetting(c.Param("setting"), string(body)); err != nil {
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
		return
	}

	c.Status(http.StatusNoContent)
}

// GetSettingsHandler handles requests to get user settings
func GetSettingsHandler(c *gin.Context) {
	setting, err := controller.GetSetting(c.Param("setting"))
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.DatabaseNotFound:
			c.JSON(http.StatusNotFound, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
		return
	}

	c.String(http.StatusOK, setting)
}
