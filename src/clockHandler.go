package main

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// ClockSyncHandler waits for the next clock start and then returns
func ClockSyncHandler(c *gin.Context) {
	manager.ClockSync()

	c.Status(http.StatusNoContent)
}

// ClockRestartHandler restarts the clock
func ClockRestartHandler(c *gin.Context) {
	manager.RestartClock()

	c.Status(http.StatusNoContent)
}

// ClockSpeedHandler sets the speed of the clock to a specific bpm count
func ClockSpeedHandler(c *gin.Context) {
	request := &model.ClockSpeedRequest{}
	err := c.BindJSON(request)
	if err != nil {
		err = sferror.New(sferror.ClockInvalidRequestBody, "failed to parse clock speed request body", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	manager.SetClockSpeed(request.BPM, request.NoteLength)

	c.Status(http.StatusNoContent)
}

// ClockSubscriptionHandler handles subscribing and unsubscribing effects on the clock
func ClockSubscriptionHandler(c *gin.Context) {
	var (
		action     = c.Param("action")
		effectType = c.Param("effectType")
		id         = c.Param("id")
	)

	request := &model.ClockSubscriptionRequest{}
	err := c.BindJSON(request)
	if err != nil {
		err = sferror.New(sferror.ClockInvalidRequestBody, "failed to parse clock request body", err)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	switch model.ClockAction(action) {
	case model.SubscribeClockAction:
		manager.SubscribeEffectToClock(id, model.EffectType(effectType), request.OffBeat, request.IsRunning)
	case model.UnsubscribeClockAction:
		manager.UnsubscribeEffectFromClock(id, model.EffectType(effectType), request.OffBeat)
		manager.StopEffect(id, false)
	default:
		err := sferror.New(sferror.ClockInvalidAction, "invlid clock action: "+effectType, nil)
		c.JSON(http.StatusBadRequest, sferror.Get(err))
		return
	}

	c.Status(http.StatusNoContent)
}
