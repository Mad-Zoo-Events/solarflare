package main

import (
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// EffectHandler handles requests to execute effect presets
func EffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		var (
			action     = vars["action"]
			id         = vars["id"]
			effectType = vars["effectType"]
		)

		err := controller.RunEffect(id, model.EffectType(effectType), model.EffectAction(action))
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.PresetNotFound:
				writeResponse(w, http.StatusNotFound, sferror.GetErrorResponse(err))
			case sferror.ActionNotAllowed, sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, http.StatusNoContent, nil)
	}
}

// StopAllHandler handles requests to stop and/or detach all effects
func StopAllHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error reading stopall request body", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		err = controller.StopAll(body)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.Encoding:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, http.StatusNoContent, nil)
	}
}
