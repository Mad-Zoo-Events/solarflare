package main

import (
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/solarflare/src/controller"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := controller.RenderControlPanel(w)
		if err != nil {
			writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
		}
	}
}

// CPPresetManagerHandler builds the preset management page from templates
func CPPresetManagerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := controller.RenderPresetManager(w)
		if err != nil {
			writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
		}
	}
}

// CPPresetHandler builds the page to create or modify a preset
func CPPresetHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		var (
			effectType = vars["effectType"]
			id         = vars["id"]
		)

		err := controller.RenderPresetModifier(w, model.EffectType(effectType), id)
		if err != nil {
			switch sferror.GetErrorType(err) {
			case sferror.InvalidEffectType:
				writeResponse(w, http.StatusBadRequest, sferror.GetErrorResponse(err))
			case sferror.PresetNotFound:
				writeResponse(w, http.StatusNotFound, sferror.GetErrorResponse(err))
			default:
				writeResponse(w, http.StatusInternalServerError, sferror.GetErrorResponse(err))
			}
		}
	}
}
