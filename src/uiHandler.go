package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/eynorey/candyshop/src/controller"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

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

// CPPresetManagerHandler builds the preset management page from templates
func CPPresetManagerHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset handler called")

		err := controller.GeneratePresetManager(w)
		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}

// CPPresetCreationHandler builds an empty preset mutation page
func CPPresetCreationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset Creation handler called")

		var err error

		switch effectType {
		case model.EffectTypeParticle:
			err = controller.GenerateParticlePresetMutationPage(w, nil)
		case model.EffectTypeDragon:
			err = controller.GenerateDragonPresetMutationPage(w, nil)
		case model.EffectTypeTimeshift:
			err = controller.GenerateTimeshiftPresetMutationPage(w, nil)
		}

		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}

// CPPresetModificationHandler builds a pre-filled preset mutation page
func CPPresetModificationHandler(effectType model.EffectType) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel Preset Modification handler called")

		vars := mux.Vars(r)

		preset, err := utils.FindPreset(vars["id"], effectType)
		if err != nil {
			writeResponse(w, 404, cserror.GetErrorResponse(err))
			return
		}

		switch effectType {
		case model.EffectTypeParticle:
			p := preset.(model.ParticleEffectPreset)
			err = controller.GenerateParticlePresetMutationPage(w, &p)
		case model.EffectTypeDragon:
			p := preset.(model.DragonEffectPreset)
			err = controller.GenerateDragonPresetMutationPage(w, &p)
		case model.EffectTypeTimeshift:
			p := preset.(model.TimeshiftEffectPreset)
			err = controller.GenerateTimeshiftPresetMutationPage(w, &p)
		}

		if err != nil {
			writeResponse(w, 500, cserror.GetErrorResponse(err))
		}
	}
}
