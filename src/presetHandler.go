package main

import (
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// PresetMutationHandler handles requests to create a new preset
func PresetMutationHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error reading preset request body", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		vars := mux.Vars(r)

		id, err := controller.UpsertPresetAPI(vars["effectType"], body)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, http.StatusCreated, []byte(*id))
	}
}

// PresetMutationUIHandler handles requests from the UI to create a new preset
func PresetMutationUIHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error parsing form from UI", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		vars := mux.Vars(r)

		_, err = controller.UpsertPresetUI(vars["effectType"], r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
			return
		}

		redirectTo(w, r, "/controlpanel/presets")
	}
}

// PresetDeletionHandler deletes a preset
func PresetDeletionHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		err := controller.DeletePreset(vars["effectType"], vars["id"])
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.DatabaseNotFound:
				writeResponse(w, http.StatusNotFound, sferror.GetErrorResponse(err))
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, http.StatusOK, nil)
	}
}

// PresetDuplicationHandler duplicates a preset
func PresetDuplicationHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)

		err := controller.DuplicatePreset(vars["effectType"], vars["id"])
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.DatabaseNotFound:
				writeResponse(w, http.StatusNotFound, sferror.GetErrorResponse(err))
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
			return
		}

		writeResponse(w, http.StatusCreated, nil)
	}
}

// PresetTestUIHandler handles requests from the UI to test a preset
func PresetTestUIHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseForm()
		if err != nil {
			err = sferror.New(sferror.Encoding, "Error parsing form from UI", err)
			writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			return
		}

		vars := mux.Vars(r)

		err = controller.TestPreset(vars["effectType"], r.PostForm)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
			return
		}
	}
}
