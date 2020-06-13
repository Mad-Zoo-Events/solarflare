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
		msg := "¯\\_(ツ)_/¯"

		writeResponse(w, 200, nil, &msg)
	}
}

// StatusHandler returns status information about the server network
func StatusHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		status := controller.GetStatus()
		resp, err := json.Marshal(status)
		if err != nil {
			msg := fmt.Sprintf("Failed to marshal status response: %s", err.Error())
			writeResponse(w, 500, nil, &msg)
			return
		}
		writeResponse(w, 200, &resp, nil)
	}
}

// DragonHandler handles requests to trigger actions on the dragon
func DragonHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, nil, &msg)
			return
		}

		dragonRequest := model.InboundDragonRequest{}
		err = json.Unmarshal(body, &dragonRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, nil, &msg)
			return
		}

		err = controller.DoDragon(dragonRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, nil, &msg)
			return
		}

		writeResponse(w, 204, nil, nil)
	}
}

// ParticleEffectHandler handles requests to trigger actions on effects
func ParticleEffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, nil, &msg)
			return
		}

		particleEffectRequest := model.InboundParticleEffectRequest{}
		err = json.Unmarshal(body, &particleEffectRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, nil, &msg)
			return
		}

		err = controller.DoParticleEffect(particleEffectRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, nil, &msg)
			return
		}

		writeResponse(w, 204, nil, nil)
	}
}

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := controller.GenerateControlPanel(w)
		if err != nil {
			writeResponse(w, 500, nil, nil)
			log.Fatalf("Error generating control panel: %s", err.Error())
		}
	}
}

// writeResponse writes the response header and a response body
// if supplied via resp []byte or respStr string
func writeResponse(w http.ResponseWriter, code int, resp *[]byte, respStr *string) {
	w.WriteHeader(code)

	if resp != nil {
		w.Write(*resp)
		log.Print(string(*resp))
	}

	if respStr != nil {
		w.Write([]byte(*respStr))
		log.Print(*respStr)
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
