package main

import (
	"encoding/json"
	"errors"
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
		w.WriteHeader(200)
		w.Write([]byte("¯\\_(ツ)_/¯"))
	}
}

// EffectsHandler handles requests to trigger actions on effects
func EffectsHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		visualType := vars["visualType"]

		body, err := ioutil.ReadAll(r.Body)
		if err != nil {
			writeResponse(w, 400, err)
			return
		}

		requestData := model.InboundEffectRequest{}
		err = json.Unmarshal(body, &requestData)
		if err != nil {
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
			err = errors.New("unknown type: " + visualType)
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
		log.Fatal(err.Error())
	}
}

func main() {
	router := mux.NewRouter()

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/effects/{visualType}", EffectsHandler()).Methods(http.MethodPost)

	http.ListenAndServe(":5000", router)
}
