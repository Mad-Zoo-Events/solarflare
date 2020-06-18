package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// GenerateControlPanel renders the control panel based on templates
func GenerateControlPanel(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		"static/templates/controlPanel/controlPanel.html",
		"static/templates/controlPanel/particleEffectControl.html",
		"static/templates/controlPanel/dragonEffectControl.html",
		"static/templates/controlPanel/timeshiftEffectControl.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading control panel templates", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets:  cfg.ParticleEffectPresets,
		DragonEffectPresets:    cfg.DragonEffectPresets,
		TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
		RegisteredServerCount:  len(cfg.Servers),
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
		"static/templates/presetManager/presetManager.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset manager template", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets:  cfg.ParticleEffectPresets,
		DragonEffectPresets:    cfg.DragonEffectPresets,
		TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
		RegisteredServerCount:  len(cfg.Servers),
	}

	err = template.Execute(writer, data)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset manager template", err)
	}

	return nil
}

// GenerateParticlePresetMutationPage renders the particle effect preset creation/edit page based on templates
func GenerateParticlePresetMutationPage(writer http.ResponseWriter, preset *model.ParticleEffectPreset) error {
	template, err := template.ParseFiles(
		"static/templates/presetManager/particlePresetMutation.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset mutation template", err)
	}

	if preset == nil {
		preset = new(model.ParticleEffectPreset)
		preset.ParticleEffects = []model.ParticleEffect{model.ParticleEffect{}}
		preset.TransformToUI()
	}

	err = template.Execute(writer, *preset)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset mutation templates", err)
	}

	return nil
}

// GenerateDragonPresetMutationPage renders the dragon preset creation/edit page based on templates
func GenerateDragonPresetMutationPage(writer http.ResponseWriter, preset *model.DragonEffectPreset) error {
	template, err := template.ParseFiles(
		"static/templates/presetManager/dragonPresetMutation.html",
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

// GenerateTimeshiftPresetMutationPage renders the timeshift preset creation/edit page based on templates
func GenerateTimeshiftPresetMutationPage(writer http.ResponseWriter, preset *model.TimeshiftEffectPreset) error {
	template, err := template.ParseFiles(
		"static/templates/presetManager/timeshiftPresetMutation.html",
	)
	if err != nil {
		return cserror.New(cserror.Template, "Error loading preset mutation template", err)
	}

	if preset == nil {
		preset = new(model.TimeshiftEffectPreset)
		preset.TransformToUI()
	}

	err = template.Execute(writer, *preset)
	if err != nil {
		return cserror.New(cserror.Template, "Error running preset mutation templates", err)
	}

	return nil
}
