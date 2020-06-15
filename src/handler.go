package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/utils"

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

// PresetMutationHandler handles requests to create a new preset
func PresetMutationHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Creation handler called")

		vars := mux.Vars(r)
		effectType := model.EffectType(vars["effectType"])

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = cserror.New(cserror.Encoding, "Error reading preset request body", err)
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}

		var id *string
		switch effectType {
		case model.EffectTypeParticleEffect:
			id, err = controller.UpsertParticleEffectPreset(body)
			if err != nil {
				// TODO error code differentiation
				writeResponse(w, 500, cserror.GetErrorResponse(err))
				return
			}
		case model.EffectTypeDragon:
			id, err = controller.UpsertDragonEffectPreset(body)
			if err != nil {
				// TODO error code differentiation
				writeResponse(w, 500, cserror.GetErrorResponse(err))
				return
			}
		default:
			err = cserror.New(cserror.BadRequest, fmt.Sprintf("Effect type %s is invalid", effectType), nil)
			writeResponse(w, 400, cserror.GetErrorResponse(err))
		}

		writeResponse(w, 201, []byte(*id))
	}
}

// PresetExecutionHandler handles requests to execute effect presets
func PresetExecutionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Effect handler called")

		vars := mux.Vars(r)
		action := model.Action(vars["action"])

		preset, err := utils.FindPreset(vars["id"])
		if err != nil {
			writeResponse(w, 404, cserror.GetErrorResponse(err))
		}
		switch preset.(type) {

		case model.ParticleEffectPreset:
			err := controller.ExecuteParticleEffectPreset(preset.(model.ParticleEffectPreset), action)
			if err != nil {
				switch cserror.GetErrorType(err) {
				case cserror.ActionNotAllowed:
					writeResponse(w, 400, cserror.GetErrorResponse(err))
				default:
					writeResponse(w, 500, cserror.GetErrorResponse(err))
				}

				return
			}

		case model.DragonEffectPreset:
			err := controller.ExecuteDragonEffectPreset(preset.(model.DragonEffectPreset), action)
			if err != nil {
				switch cserror.GetErrorType(err) {
				case cserror.ActionNotAllowed:
					writeResponse(w, 400, cserror.GetErrorResponse(err))
				default:
					writeResponse(w, 500, cserror.GetErrorResponse(err))
				}

				return
			}
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

// ControlPanelPresetHandler builds the preset management page from templates
func ControlPanelPresetHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset handler called")
		err := controller.GeneratePresetManager(w)
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
