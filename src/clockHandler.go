package main

import (
	"encoding/json"
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
		writeResponse(w, http.StatusNoContent, nil)
	}
}

// ClockRestartHandler restarts the clock
func ClockRestartHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		manager.RestartClock()

		writeResponse(w, http.StatusNoContent, nil)
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
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		mult, err := strconv.ParseFloat(multStr, 64)
		if err != nil {
			err = sferror.New(sferror.ClockInvalidBPM, "invlid multiplier value: "+multStr, nil)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		manager.SetClockSpeed(bpm, mult)

		writeResponse(w, http.StatusNoContent, nil)
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

		request := &model.ClockSubscriptionRequest{}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			err = sferror.New(sferror.ClockInvalidRequestBody, "failed to parse clock request body", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
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
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		writeResponse(w, http.StatusNoContent, nil)
	}
}
