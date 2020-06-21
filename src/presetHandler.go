package main

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
	"github.com/gorilla/mux"
)

// PresetMutationHandler handles requests to create a new preset
func PresetMutationHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Mutation handler called")

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error reading preset request body", err)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		vars := mux.Vars(r)

		id, err := controller.UpsertPresetAPI(vars["effectType"], body)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, 400, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, sferror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, 201, []byte(*id))
	}
}

// PresetMutationUIHandler handles requests from the UI to create a new preset
func PresetMutationUIHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Mutation UI handler called")

		err := r.ParseForm()
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error parsing form from UI", err)
			writeResponse(w, 400, sferror.GetErrorResponse(err))
			return
		}

		vars := mux.Vars(r)

		_, err = controller.UpsertPresetUI(vars["effectType"], r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, 400, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, sferror.GetErrorResponse(err))
			}
			return
		}

		redirectTo(w, "/controlpanel/presets")
	}
}

// PresetDeletionHandler deletes a preset
func PresetDeletionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Preset Deletion handler called")

		vars := mux.Vars(r)

		err := controller.DeletePreset(vars["effectType"], vars["id"])
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.DatabaseNotFound:
				writeResponse(w, 404, sferror.GetErrorResponse(err))
			case sferror.InvalidEffectType:
				writeResponse(w, 400, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, 500, sferror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, 200, nil)
	}
}
