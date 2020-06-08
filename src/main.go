package main

import (
	"errors"
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

// VisualHandler handles requests to trigger actions on visuals
func VisualHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		visual := vars["visual"]
		action := vars["action"]

		var err error

		switch model.Action(action) {
		case model.StartVisualAction:
			err = controller.StartVisual(visual)
		default:
			err = errors.New("unknown action: " + action)
		}

		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
			return
		}

		w.WriteHeader(204)
	}
}

// ControlPanelHandler builds the control panel from templates
func ControlPanelHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := controller.GenerateControlPanel(w)
		if err != nil {
			w.WriteHeader(500)
			w.Write([]byte(err.Error()))
		}
	}
}

func main() {
	router := mux.NewRouter()

	staticDir := "/static/"
	router.PathPrefix(staticDir).Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))
	router.Handle("/health", HealthHandler()).Methods(http.MethodGet)
	router.Handle("/controlpanel", ControlPanelHandler()).Methods(http.MethodGet)
	router.Handle("/visuals/{visual}/{action}", VisualHandler()).Methods(http.MethodPost)

	http.ListenAndServe(":5000", router)
}
