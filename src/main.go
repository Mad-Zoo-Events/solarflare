package main

import (
	"encoding/json"
	"errors"
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
		shrug := "¯\\_(ツ)_/¯"

		log.Print(shrug)
		w.WriteHeader(200)
		w.Write([]byte(shrug))
	}
}

// EffectsHandler handles requests to trigger actions on effects
func EffectsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		visualType := vars["visualType"]

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			log.Fatalf("failed to read effects request: %s", err.Error())
			writeResponse(w, 400, err)
			return
		}

		requestData := model.InboundEffectRequest{}
		err = json.Unmarshal(body, &requestData)
		if err != nil {
			log.Fatalf("failed to unmarshal effects request: %s", err.Error())
			writeResponse(w, 400, err)
			return
		}

		action := model.Action(requestData.Action)

		switch model.VisualType(visualType) {
		case model.VisualTypeParticleEffect:
			err = controller.DoParticleEffect(*requestData.VisualName, action)
		case model.VisualTypeDragon:
			err = controller.DoDragon(action)
		default:
			msg := fmt.Sprintf("unknown visual type: %s", visualType)
			log.Fatal(msg)
			err = errors.New(msg)
		}

		if err != nil {
			writeResponse(w, 500, err)
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
			writeResponse(w, 500, err)
		}
	}
}

func writeResponse(w http.ResponseWriter, code int, err error) {
	w.WriteHeader(code)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
}

func main() {
	router := mux.NewRouter()

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/effects/{visualType}", EffectsHandler()).Methods(http.MethodPost)

	log.Print("Starting server listening on port 5000")

	http.ListenAndServe(":5000", router)

	log.Print("Server shut down")
}
