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
		controlPanelPath+"particleEffectControl.html",
		controlPanelPath+"dragonEffectControl.html",
		controlPanelPath+"timeshiftEffectControl.html",
		controlPanelPath+"potionEffectControl.html",
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
		RegisteredServerCount:  len(cfg.Servers),
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
		RegisteredServerCount:  len(cfg.Servers),
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
	case model.EffectTypeParticle:
		presetName = "particlePresetModification.html"
	case model.EffectTypeDragon:
		presetName = "dragonPresetModification.html"
	case model.EffectTypeTimeshift:
		presetName = "timeshiftPresetModification.html"
	case model.EffectTypePotion:
		presetName = "potionPresetModification.html"
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
	case model.EffectTypeParticle:
		p := model.ParticleEffectPreset{}

		if id != "" {
			p = preset.(model.ParticleEffectPreset)
		} else {
			p.ParticleEffects = []model.ParticleEffect{model.ParticleEffect{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.EffectTypeDragon:
		p := model.DragonEffectPreset{}

		if id != "" {
			p = preset.(model.DragonEffectPreset)
		} else {
			p.DragonEffects = []model.DragonEffect{model.DragonEffect{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.EffectTypeTimeshift:
		p := model.TimeshiftEffectPreset{}

		if id != "" {
			p = preset.(model.TimeshiftEffectPreset)
		} else {
			p.TimeshiftEffects = []model.TimeshiftEffect{model.TimeshiftEffect{}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	case model.EffectTypePotion:
		p := model.PotionEffectPreset{}

		if id != "" {
			p = preset.(model.PotionEffectPreset)
		} else {
			p.PotionEffects = []model.PotionEffect{model.PotionEffect{Amplifier: 1}}
		}

		p.TransformToUI()
		err = template.Execute(writer, p)
	}

	if err != nil {
		return sferror.New(sferror.Template, "Error executing preset modification templates", err)
	}

	return nil
}
