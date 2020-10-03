package main

import (
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
