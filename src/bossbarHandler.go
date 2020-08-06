package main

import (
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// BossbarHandler handles requests to control the bossbar
func BossbarHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error parsing the bossbar request", err)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		action := mux.Vars(r)["action"]

		err = controller.SetBossbar(model.EffectAction(action), r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.ActionNotAllowed, sferror.InvalidEffectType, sferror.Encoding:
				writeResponse(w, 400, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, sferror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, 204, nil)
	}
}
