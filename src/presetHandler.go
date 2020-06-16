package main

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/controller"
	"github.com/eynorey/candyshop/src/manager"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
	"github.com/gorilla/mux"
)

// PresetMutationHandler handles requests to create a new preset
func PresetMutationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Mutation handler called")

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = cserror.New(cserror.Encoding, "Error reading preset request body", err)
			writeResponse(w, 400, cserror.GetErrorResponse(err))
			return
		}

		id, err := controller.UpsertPresetAPI(effectType, body)
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

		err := r.ParseForm()
		if err != nil {
			err = cserror.New(cserror.Encoding, "Error parsing form from UI", err)
			writeResponse(w, 400, cserror.GetErrorResponse(err))
			return
		}

		_, err = controller.UpsertPresetUI(effectType, r.PostForm)
		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
			return
		}

		redirectTo(w, "/controlpanel/presets")
	}
}

// PresetDeletionHandler deletes a preset
func PresetDeletionHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Deletion handler called")

		vars := mux.Vars(r)
		id := vars["id"]

		err := manager.DeletePreset(effectType, id)

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
