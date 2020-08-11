package main

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// ClockSyncHandler waits for the next clock start and then returns
func ClockSyncHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		manager.ClockSync()
		writeResponse(w, 204, nil)
	}
}

// ClockRestartHandler restarts the clock
func ClockRestartHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		manager.RestartClock()

		writeResponse(w, 204, nil)
	}
}

// ClockSpeedHandler sets the speed of the clock to a specific bpm count
func ClockSpeedHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		var (
			bpmStr  = vars["bpm"]
			multStr = vars["multiplier"]
		)

		bpm, err := strconv.ParseFloat(bpmStr, 64)
		if err != nil {
			err = sferror.New(sferror.ClockInvalidBPM, "invlid BPM value: "+bpmStr, nil)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		mult, err := strconv.ParseFloat(multStr, 64)
		if err != nil {
			err = sferror.New(sferror.ClockInvalidBPM, "invlid multiplier value: "+multStr, nil)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		manager.SetClockSpeed(bpm, mult)

		writeResponse(w, 204, nil)
	}
}

// ClockSubscriptionHandler handles subscribing and unsubscribing effects on the clock
func ClockSubscriptionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		var (
			action     = vars["action"]
			effectType = vars["effectType"]
			id         = vars["id"]
		)

		switch model.ClockAction(action) {
		case model.SubscribeClockAction:
			manager.SubscribeEffectToClock(id, model.EffectType(effectType), false)
		case model.SubscribeRunningClockAction:
			manager.SubscribeEffectToClock(id, model.EffectType(effectType), true)
		case model.UnsubscribeClockAction, model.UnsubscribeRunningClockAction:
			manager.UnsubscribeEffectFromClock(id, model.EffectType(effectType), false)
		default:
			err := sferror.New(sferror.ClockInvalidAction, "invlid clock action: "+effectType, nil)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		writeResponse(w, 204, nil)
	}
}
