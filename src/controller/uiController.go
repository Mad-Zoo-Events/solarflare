package controller

import (
	"html/template"
	"net/http"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
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
		controlPanelPath+"stageSelector.html",
		controlPanelPath+"serverManager.html",
		controlPanelPath+"particleEffectControl.html",
		controlPanelPath+"dragonEffectControl.html",
		controlPanelPath+"timeshiftEffectControl.html",
		controlPanelPath+"potionEffectControl.html",
		controlPanelPath+"laserEffectControl.html",
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

		MinecraftColors:   model.MinecraftColors,
		RegisteredServers: cfg.Servers,
		ActiveServerCount: len(getActiveServerIDs()),

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

// RenderPresetManager renders the preset management page based on templates
func RenderPresetManager(writer http.ResponseWriter) error {
	template, err := template.ParseFiles(
		presetManagerPath+"presetManager.html",
		templatesPath+"shared.html",
	)
	if err != nil {
		return sferror.New(sferror.Template, "Error loading preset manager template", err)
	}

	cfg := config.Get()
	data := model.ControlPanel{
		ParticleEffectPresets:  cfg.ParticleEffectPresets,
		DragonEffectPresets:    cfg.DragonEffectPresets,
		TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
		PotionEffectPresets:    cfg.PotionEffectPresets,
		LaserEffectPresets:     cfg.LaserEffectPresets,
	}

	err = template.Execute(writer, data)
	if err != nil {
		return sferror.New(sferror.Template, "Error executing preset manager template", err)
	}

	return nil
}

// RenderPresetModifier renders the preset modification/creation page based on templates
func RenderPresetModifier(writer http.ResponseWriter, effectType model.EffectType, id string) error {
	var (
		preset     interface{}
		err        error
		presetName string
	)

	switch effectType {
	case model.ParticleEffectType:
		presetName = "particlePresetModification.html"
	case model.DragonEffectType:
		presetName = "dragonPresetModification.html"
	case model.TimeshiftEffectType:
		presetName = "timeshiftPresetModification.html"
	case model.PotionEffectType:
		presetName = "potionPresetModification.html"
	case model.LaserEffectType:
		presetName = "laserPresetModification.html"
	default:
		return sferror.New(sferror.InvalidEffectType, string(effectType), err)
	}

	template, err := template.ParseFiles(
		presetManagerPath+presetName,
		presetManagerPath+"shared.html",
		templatesPath+"shared.html",
	)
	if err != nil {
		return sferror.New(sferror.Template, "Error loading preset modification template", err)
	}

	if id != "" {
		if preset, err = utils.FindPreset(id, effectType); err != nil {
			return err
		}
	}

	switch effectType {
	case model.ParticleEffectType:
		p := model.ParticleEffectPreset{}

		if id != "" {
			p = preset.(model.ParticleEffectPreset)
		} else {
			p.ParticleEffects = []model.ParticleEffect{{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.DragonEffectType:
		p := model.DragonEffectPreset{}

		if id != "" {
			p = preset.(model.DragonEffectPreset)
		} else {
			p.DragonEffects = []model.DragonEffect{{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.TimeshiftEffectType:
		p := model.TimeshiftEffectPreset{}

		if id != "" {
			p = preset.(model.TimeshiftEffectPreset)
		} else {
			p.TimeshiftEffects = []model.TimeshiftEffect{{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.PotionEffectType:
		p := model.PotionEffectPreset{}

		if id != "" {
			p = preset.(model.PotionEffectPreset)
		} else {
			p.PotionEffects = []model.PotionEffect{{Amplifier: 1}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.LaserEffectType:
		p := model.LaserEffectPreset{}

		if id != "" {
			p = preset.(model.LaserEffectPreset)
		} else {
			p.IsEndLaser = true
			p.IsNonPlayerTargeting = true
			p.LaserEffects = []model.LaserEffect{{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	}

	if err != nil {
		return sferror.New(sferror.Template, "Error executing preset modification templates", err)
	}

	return nil
}
