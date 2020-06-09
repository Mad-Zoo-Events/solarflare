package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// GenerateControlPanel renders the control panel based on templates
func GenerateControlPanel(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		"static/templates/controlPanel.html",
		"static/templates/particleEffectControl.html",
		"static/templates/dragonControl.html",
	)
	if err != nil {
		return err
	}

	data := model.ControlPanel{
		ParticleEffects: config.GetParticleEffects(),
		Dragon:          config.GetDragon(),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return err
	}

	return nil
}
