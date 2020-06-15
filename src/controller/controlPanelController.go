package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/candyshop/src/utils/cserror"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// GenerateControlPanel renders the control panel based on templates
func GenerateControlPanel(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		"static/templates/controlPanel.html",
		"static/templates/particleEffectControl.html",
		"static/templates/dragonEffectControl.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading control panel templates", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets: cfg.ParticleEffectPresets,
		DragonEffectPresets:   cfg.DragonEffectPresets,
		RegisteredServerCount: len(cfg.Servers),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return cserror.New(cserror.Template, "Error running control panel templates", err)
	}

	return nil
}

// GeneratePresetManager renders the preset management page based on templates
func GeneratePresetManager(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		"static/templates/presetManager.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset manager template", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets: cfg.ParticleEffectPresets,
		DragonEffectPresets:   cfg.DragonEffectPresets,
		RegisteredServerCount: len(cfg.Servers),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset manager template", err)
	}

	return nil
}

// GenerateDragonPresetMutationPage renders the dragon preset creation/edit page based on templates
func GenerateDragonPresetMutationPage(writer http.ResponseWriter, preset *model.DragonEffectPreset) error {
	template, err := template.ParseFiles(
		"static/templates/dragonPresetMutation.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset mutation template", err)
	}

	if preset == nil {
		preset = new(model.DragonEffectPreset)
		preset.DragonEffects = []model.DragonEffect{model.DragonEffect{}}
	}

	err = template.Execute(writer, *preset)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset mutation templates", err)
	}

	return nil
}

// GenerateParticlePresetMutationPage renders the particle effect preset creation/edit page based on templates
func GenerateParticlePresetMutationPage(writer http.ResponseWriter, preset *model.ParticleEffectPreset) error {
	template, err := template.ParseFiles(
		"static/templates/particlePresetMutation.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset mutation template", err)
	}

	if preset == nil {
		preset = new(model.ParticleEffectPreset)
	}

	err = template.Execute(writer, *preset)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset mutation templates", err)
	}

	return nil
}
