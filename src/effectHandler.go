package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// EffectHandler handles requests to execute effect presets
func EffectHandler(c *gin.Context) {
	err := controller.RunEffect(
		c.Param("id"),
		model.EffectType(c.Param("effectType")),
		model.EffectAction(c.Param("action")),
	)

	if err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.PresetNotFound:
			c.JSON(http.StatusNotFound, sferror.Get(err))
		case sferror.ActionNotAllowed, sferror.InvalidEffectType:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}

		return
	}

	c.Status(http.StatusNoContent)
}

// StopAllHandler handles requests to stop and/or detach all effects
func StopAllHandler(c *gin.Context) {
	request := &model.StopAllRequest{}
	if err := c.BindJSON(request); err != nil {
		err = sferror.New(sferror.Encoding, "Error unmarshalling stopall request", err)
	}

	if err := manager.StopAll(request); err != nil {
		switch sferror.GetErrorType(err) {
		case sferror.Encoding:
			c.JSON(http.StatusBadRequest, sferror.Get(err))
		default:
			c.JSON(http.StatusInternalServerError, sferror.Get(err))
		}

		return
	}

	c.Status(http.StatusNoContent)
}
