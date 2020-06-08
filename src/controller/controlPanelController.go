package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/candyshop/src/model"
)

// GenerateControlPanel renders the control panel based on templates
func GenerateControlPanel(writer http.ResponseWriter) error {
	template, err := template.ParseFiles("static/templates/controlPanel.html", "static/templates/visualControl.html")
	if err != nil {
		return err
	}

	data := model.ControlPanel{
		Effects: getEffects(),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return err
	}

	return nil
}

// hardcoded for now
func getEffects() []model.VisualControl {
	dragon := model.VisualControl{
		Name:         "dragon",
		AllowTrigger: false,
		AllowStart:   true,
		AllowRestart: true,
		AllowStop:    true,
	}

	hearts := model.VisualControl{
		Name:         "hearts",
		AllowTrigger: true,
		AllowStart:   true,
		AllowRestart: false,
		AllowStop:    true,
	}

	flashes := model.VisualControl{
		Name:         "flashes",
		AllowTrigger: true,
		AllowStart:   true,
		AllowRestart: false,
		AllowStop:    true,
	}

	return []model.VisualControl{dragon, hearts, flashes}
}
