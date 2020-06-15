package main

import (
	"encoding/json"
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
func PresetMutationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Mutation handler called")

		var id *string
		var err error

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = cserror.New(cserror.Encoding, "Error reading preset request body", err)
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}

		switch effectType {
		case model.EffectTypeParticleEffect:
			preset := model.ParticleEffectPreset{}
			err = json.Unmarshal(body, &preset)
			if err != nil {
				err = cserror.New(cserror.Encoding, "Error unmarshalling particle effect preset request", err)
				return
			}
			id, err = controller.UpsertParticleEffectPreset(preset)
		case model.EffectTypeDragon:
			preset := model.DragonEffectPreset{}
			err = json.Unmarshal(body, &preset)
			if err != nil {
				err = cserror.New(cserror.Encoding, "Error unmarshalling dragon effect preset request", err)
				return
			}
			id, err = controller.UpsertDragonEffectPreset(preset)
		}

		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
			return
		}

		writeResponse(w, 201, []byte(*id))
	}
}

// PresetMutationUIHandler handles requests from the UI to create a new preset
func PresetMutationUIHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Mutation UI handler called")

		var err error

		switch effectType {
		case model.EffectTypeParticleEffect:
			// id, err = controller.UpsertParticleEffectPreset(preset)
			return
		case model.EffectTypeDragon:
			preset, err := utils.GetUIDragonPreset(r)
			if err == nil {
				_, err = controller.UpsertDragonEffectPreset(*preset)
			}
		}

		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
			return
		}

		err = controller.GeneratePresetManager(w)
		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}

// PresetDeletionHandler deletes a preset
func PresetDeletionHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Deletion handler called")

		vars := mux.Vars(r)
		id := vars["id"]

		err := controller.DeletePreset(effectType, id)

		if err != nil {
			switch cserror.GetErrorType(err) {
			case cserror.DatabaseNotFound:
				writeResponse(w, 404, cserror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, cserror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, 200, nil)
	}
}

// PresetExecutionHandler handles requests to execute effect presets
func PresetExecutionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Effect handler called")

		vars := mux.Vars(r)
		action := model.Action(vars["action"])
		var err error

		preset, err := utils.FindPreset(vars["id"])
		if err != nil {
			writeResponse(w, 404, cserror.GetErrorResponse(err))
			return
		}

		switch preset.(type) {
		case model.ParticleEffectPreset:
			err = controller.ExecuteParticleEffectPreset(preset.(model.ParticleEffectPreset), action)
		case model.DragonEffectPreset:
			err = controller.ExecuteDragonEffectPreset(preset.(model.DragonEffectPreset), action)
		}

		if err != nil {
			switch cserror.GetErrorType(err) {
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

// ControlPanelPresetCreationHandler builds an empty preset mutation page
func ControlPanelPresetCreationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset Creation handler called")

		var err error

		switch effectType {
		case model.EffectTypeParticleEffect:
			// err = controller.GenerateParticlePresetMutationPage(w, nil)
			return
		case model.EffectTypeDragon:
			err = controller.GenerateDragonPresetMutationPage(w, nil)
		}

		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}

// ControlPanelPresetModificationHandler builds a pre-filled preset mutation page
func ControlPanelPresetModificationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset Creation handler called")

		vars := mux.Vars(r)

		preset, err := utils.FindPreset(vars["id"])
		if err != nil {
			writeResponse(w, 404, cserror.GetErrorResponse(err))
			return
		}

		switch preset.(type) {
		case model.ParticleEffectPreset:
			p := preset.(model.ParticleEffectPreset)
			err = controller.GenerateParticlePresetMutationPage(w, &p)
			return
		case model.DragonEffectPreset:
			p := preset.(model.DragonEffectPreset)
			err = controller.GenerateDragonPresetMutationPage(w, &p)
		}

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
