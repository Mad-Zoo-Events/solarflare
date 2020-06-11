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

		writeResponse(w, 200, &msg)
	}
}

// DragonHandler handles requests to trigger actions on the dragon
func DragonHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, &msg)
			return
		}

		dragonRequest := model.InboundDragonRequest{}
		err = json.Unmarshal(body, &dragonRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, &msg)
			return
		}

		err = controller.DoDragon(dragonRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, &msg)
			return
		}

		writeResponse(w, 204, nil)
	}
}

// ParticleEffectHandler handles requests to trigger actions on effects
func ParticleEffectHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			msg := fmt.Sprintf("Failed to read effects request: %s", err.Error())
			writeResponse(w, 400, &msg)
			return
		}

		particleEffectRequest := model.InboundParticleEffectRequest{}
		err = json.Unmarshal(body, &particleEffectRequest)
		if err != nil {
			msg := fmt.Sprintf("Failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, &msg)
			return
		}

		err = controller.DoParticleEffect(particleEffectRequest)
		if err != nil {
			msg := err.Error()
			writeResponse(w, 500, &msg)
			return
		}

		writeResponse(w, 204, nil)
	}
}

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := controller.GenerateControlPanel(w)
		if err != nil {
			writeResponse(w, 500, nil)
			log.Fatalf("Error generating control panel: %s", err.Error())
		}
	}
}

func writeResponse(w http.ResponseWriter, code int, msg *string) {
	w.WriteHeader(code)

	if msg != nil {
		w.Write([]byte(*msg))
		log.Print(*msg)
	}
}

func main() {
	router := mux.NewRouter()

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)

	router.Handle("/effects/dragon", DragonHandler()).Methods(http.MethodPost)
	router.Handle("/effects/particle", ParticleEffectHandler()).Methods(http.MethodPost)

	log.Print("Starting server listening on port 5000")

	http.ListenAndServe(":5000", router)

	log.Print("Server shut down")
}
