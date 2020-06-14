package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"

	"github.com/eynorey/candyshop/src/controller"
)

// HealthHandler returns the health status of the service
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Health handler called")

		resp := "¯\\_(ツ)_/¯"

		writeResponse(w, 200, []byte(resp))
	}
}

// StatusHandler returns status information about the server network
func StatusHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Status handler called")

		status := controller.GetStatus()

		resp, err := json.Marshal(status)
		if err != nil {
			err = cserror.New(cserror.Encoding, "Failed to marshal status response", err)
			writeResponse(w, 500, cserror.GetErrorResponse(err))
			return
		}

		writeResponse(w, 200, resp)
	}
}

// EffectHandler handles requests to execute effect templates
func EffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Effect handler called")

		vars := mux.Vars(r)
		id := vars["id"]
		action := model.Action(vars["action"])

		if action != model.TriggerEffectAction &&
			action != model.StartEffectAction &&
			action != model.RestartEffectAction &&
			action != model.StopEffectAction {
			writeResponse(w, 400, []byte("Unknown action: "+action))
		}

		err := controller.ExecuteParticleEffect(id, action)
		if err != nil {
			switch cserror.GetErrorType(err) {
			case cserror.PresetNotFound:
				writeResponse(w, 404, cserror.GetErrorResponse(err))
			case cserror.ActionNotAllowed:
				writeResponse(w, 400, cserror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, cserror.GetErrorResponse(err))
			}

			return
		}

		writeResponse(w, 204, nil)
	}
}

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel handler called")
		err := controller.GenerateControlPanel(w)
		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}

// writeResponse writes the response header and a response body if supplied
func writeResponse(w http.ResponseWriter, code int, body []byte) {
	w.WriteHeader(code)

	if body != nil {
		w.Write(body)
	}
}
