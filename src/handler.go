package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/utils"

	"github.com/eynorey/candyshop/src/controller"
	"github.com/eynorey/candyshop/src/model"
)

// HealthHandler returns the health status of the service
func HealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Health called")

		resp := "¯\\_(ツ)_/¯"

		writeResponse(w, 200, []byte(resp))
	}
}

// StatusHandler returns status information about the server network
func StatusHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Status called")

		status := controller.GetStatus()
		resp, err := json.Marshal(status)
		if err != nil {
			err = utils.HandleError("Failed to marshal status response", err)
			writeResponse(w, 500, []byte(err.Error()))
			return
		}

		writeResponse(w, 200, resp)
	}
}

// DragonHandler handles requests to trigger actions on the dragon
func DragonHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Dragon called")

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = utils.HandleError("Failed to read dragon request", err)
			writeResponse(w, 400, []byte(err.Error()))
			return
		}

		dragonRequest := model.InboundDragonRequest{}
		err = json.Unmarshal(body, &dragonRequest)
		if err != nil {
			err = utils.HandleError("Failed to unmarshal dragon request", err)
			writeResponse(w, 400, []byte(err.Error()))
			return
		}

		err = controller.DoDragon(dragonRequest)
		if err != nil {
			writeResponse(w, 500, []byte(err.Error()))
			return
		}

		writeResponse(w, 204, nil)
	}
}

// ParticleEffectHandler handles requests to trigger actions on particle effects
func ParticleEffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Partocle Effect called")
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			err = utils.HandleError("Failed to read particle effects request", err)
			writeResponse(w, 400, []byte(err.Error()))
			return
		}

		particleEffectRequest := model.InboundParticleEffectRequest{}
		err = json.Unmarshal(body, &particleEffectRequest)
		if err != nil {
			err = utils.HandleError("Failed to unmarshal particle effects request", err)
			writeResponse(w, 400, []byte(err.Error()))
			return
		}

		err = controller.DoParticleEffect(particleEffectRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, []byte(msg))
			return
		}

		writeResponse(w, 204, nil)
	}
}

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Control Panel called")
		err := controller.GenerateControlPanel(w)
		if err != nil {
			err = utils.HandleError("Error generating control panel", err)
			writeResponse(w, 500, []byte(err.Error()))
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
