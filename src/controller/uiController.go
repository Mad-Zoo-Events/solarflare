package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	templatesPath     = "static/templates/"
	controlPanelPath  = templatesPath + "controlPanel/"
	presetManagerPath = templatesPath + "presetManager/"
)

// RenderControlPanel renders the control panel based on templates
func RenderControlPanel(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		controlPanelPath+"controlPanel.html",
		controlPanelPath+"bossbarForm.html",
		controlPanelPath+"commandForm.html",
		controlPanelPath+"stageSelector.html",
		controlPanelPath+"headerButtons.html",
		controlPanelPath+"particleEffectControl.html",
		controlPanelPath+"dragonEffectControl.html",
		controlPanelPath+"timeshiftEffectControl.html",
		controlPanelPath+"potionEffectControl.html",
		controlPanelPath+"laserEffectControl.html",
		controlPanelPath+"commandEffectControl.html",
		templatesPath+"shared.html",
	)
	if err != nil {
		return sferror.New(sferror.Template, "Error loading control panel templates", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets:  cfg.ParticleEffectPresets,
		DragonEffectPresets:    cfg.DragonEffectPresets,
		TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
		PotionEffectPresets:    cfg.PotionEffectPresets,
		LaserEffectPresets:     cfg.LaserEffectPresets,
		CommandEffectPresets:   cfg.CommandEffectPresets,

		MinecraftColors:   model.MinecraftColors,
		RegisteredServers: cfg.Servers,

		Stages:        cfg.Stages,
		SelectedStage: cfg.SelectedStage,

		AppVersion: cfg.AppVersion,
	}

	err = template.Execute(writer, data)
	if err != nil {
		return sferror.New(sferror.Template, "Error executing control panel templates", err)
	}

	return nil
}
