package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/eynorey/candyshop/src/controller"
	"github.com/eynorey/candyshop/src/model"
	"github.com/gorilla/mux"
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
			msg := fmt.Sprintf("Failed to marshal status response: %s", err.Error())
			writeResponse(w, 500, []byte(msg))
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
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, []byte(msg))
			return
		}

		dragonRequest := model.InboundDragonRequest{}
		err = json.Unmarshal(body, &dragonRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, []byte(msg))
			return
		}

		err = controller.DoDragon(dragonRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, []byte(msg))
			return
		}

		writeResponse(w, 204, nil)
	}
}

// ParticleEffectHandler handles requests to trigger actions on effects
func ParticleEffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Print(">> Partocle Effect called")
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, []byte(msg))
			return
		}

		particleEffectRequest := model.InboundParticleEffectRequest{}
		err = json.Unmarshal(body, &particleEffectRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, []byte(msg))
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
			writeResponse(w, 500, nil)
			log.Fatalf("Error generating control panel: %s", err.Error())
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

func main() {
	router := mux.NewRouter()

	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)

	router.Handle("/status", StatusHandler()).Methods(http.MethodGet)

	router.Handle("/effects/dragon", DragonHandler()).Methods(http.MethodPost)
	router.Handle("/effects/particle", ParticleEffectHandler()).Methods(http.MethodPost)

	log.Print("Starting server listening on port 5000")

	http.ListenAndServe(":5000", router)

	log.Print("Server shut down")
}
