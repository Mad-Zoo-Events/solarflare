package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/candyshop/src/controller"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// EffectHandler handles requests to execute effect presets
func EffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Effect handler called")

		vars := mux.Vars(r)
		var (
			action     = model.Action(vars["action"])
			id         = vars["id"]
			effectType = model.EffectType(vars["effectType "])
		)

		err := controller.RunEffect(id, effectType, action)
		if err != nil {
			switch cserror.GetErrorType(err) {
			case cserror.PresetNotFound:
				writeResponse(w, 404, cserror.GetErrorResponse(err))
			case cserror.ActionNotAllowed, cserror.InvalidEffectType:
				writeResponse(w, 400, cserror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, cserror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, 204, nil)
	}
}
