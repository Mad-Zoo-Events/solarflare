package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler(c *gin.Context) {
	err := controller.RenderControlPanel(c.Writer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
	}
}

// CPPresetManagerHandler builds the preset management page from templates
func CPPresetManagerHandler(c *gin.Context) {
	err := controller.RenderPresetManager(c.Writer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, sferror.Get(err))
	}
}

// CPPresetHandler builds the page to create or modify a preset
func CPPresetHandler(c *gin.Context) {
	err := controller.RenderPresetModifier(c.Writer, model.EffectType(c.Param("effectType")), c.Param("id"))
	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		case sferror.PresetNotFound:
			c.JSON(http.StatusNotFound, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}
	}
}
