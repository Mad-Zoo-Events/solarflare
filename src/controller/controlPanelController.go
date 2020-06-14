package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/candyshop/src/utils"

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
		return utils.HandleError("Error loading control panel templates", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets: cfg.ParticleEffectPresets,
		DragonEffectPresets:   cfg.DragonEffectPresets,
		RegisteredServerCount: len(cfg.Servers),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return utils.HandleError("Error running control panel templates", err)
	}

	return nil
}
