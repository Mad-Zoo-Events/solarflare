package controller

import (
	"encoding/json"
	"time"

	"github.com/eynorey/solarflare/src/utils"
	"github.com/google/uuid"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// UpsertPresetAPI inserts a new preset or updates an existing one from an API request
func UpsertPresetAPI(effectType string, body []byte) (*string, error) {
	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		preset := model.ParticleEffectPresetAPI{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling particle effect preset request", err)
		}

		return manager.UpsertParticleEffectPreset(preset.FromAPI())
	case model.DragonEffectType:
		preset := model.DragonEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling dragon effect preset request", err)
		}

		return manager.UpsertDragonEffectPreset(preset)
	case model.TimeshiftEffectType:
		preset := model.TimeshiftEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling timeshift effect preset request", err)
		}

		return manager.UpsertTimeshiftEffectPreset(preset)
	case model.PotionEffectType:
		preset := model.PotionEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling potion effect preset request", err)
		}

		return manager.UpsertPotionEffectPreset(preset)
	case model.LaserEffectType:
		preset := model.LaserEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling laser effect preset request", err)
		}

		return manager.UpsertLaserEffectPreset(preset)
	case model.CommandEffectType:
		preset := model.CommandEffectPresetAPI{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling command effect preset request", err)
		}

		return manager.UpsertCommandEffectPreset(preset.FromAPI())
	case model.LightningEffectType:
		preset := model.LightningEffectPresetAPI{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling lightning effect preset request", err)
		}

		return manager.UpsertLightningEffectPreset(preset.FromAPI())
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// DeletePreset deletes a preset and reloads
func DeletePreset(effectType, id string) error {
	cfg := config.Get()
	var err error

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		err = client.DeleteItem(client.ParticleEffectPresetsTable, id)
		if err == nil {
			cfg.SetParticleEffectPresets(client.GetParticleEffectPresets())
		}
	case model.DragonEffectType:
		err = client.DeleteItem(client.DragonEffectPresetsTable, id)
		if err == nil {
			cfg.SetDragonEffectPresets(client.GetDragonEffectPresets())
		}
	case model.TimeshiftEffectType:
		err = client.DeleteItem(client.TimeshiftEffectPresetsTable, id)
		if err == nil {
			cfg.SetTimeshiftEffectPresets(client.GetTimeshiftEffectPresets())
		}
	case model.PotionEffectType:
		err = client.DeleteItem(client.PotionEffectPresetsTable, id)
		if err == nil {
			cfg.SetPotionEffectPresets(client.GetPotionEffectPresets())
		}
	case model.LaserEffectType:
		err = client.DeleteItem(client.LaserEffectPresetsTable, id)
		if err == nil {
			cfg.SetLaserEffectPresets(client.GetLaserEffectPresets())
		}
	case model.CommandEffectType:
		err = client.DeleteItem(client.CommandEffectPresetsTable, id)
		if err == nil {
			cfg.SetCommandEffectPresets(client.GetCommandEffectPresets())
		}
	case model.LightningEffectType:
		err = client.DeleteItem(client.LightningEffectPresetsTable, id)
		if err == nil {
			cfg.SetLightningEffectPresets(client.GetLightningEffectPresets())
		}
	default:
		err = sferror.New(sferror.InvalidEffectType, effectType, nil)
	}

	return err
}

// DuplicatePreset duplicates a preset and reloads
func DuplicatePreset(effectType, id string) (newID *string, err error) {
	preset, err := utils.FindPreset(id, model.EffectType(effectType))
	if err != nil {
		return nil, err
	}

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		p := preset.(model.ParticleEffectPreset)
		p.ID = ""
		return manager.UpsertParticleEffectPreset(p)
	case model.DragonEffectType:
		p := preset.(model.DragonEffectPreset)
		p.ID = ""
		return manager.UpsertDragonEffectPreset(p)
	case model.TimeshiftEffectType:
		p := preset.(model.TimeshiftEffectPreset)
		p.ID = ""
		return manager.UpsertTimeshiftEffectPreset(p)
	case model.PotionEffectType:
		p := preset.(model.PotionEffectPreset)
		p.ID = ""
		return manager.UpsertPotionEffectPreset(p)
	case model.LaserEffectType:
		p := preset.(model.LaserEffectPreset)
		p.ID = ""
		return manager.UpsertLaserEffectPreset(p)
	case model.CommandEffectType:
		p := preset.(model.CommandEffectPreset)
		p.ID = ""
		return manager.UpsertCommandEffectPreset(p)
	case model.LightningEffectType:
		p := preset.(model.LightningEffectPreset)
		p.ID = ""
		return manager.UpsertLightningEffectPreset(p)
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// RetrievePresets retrieves all preset of a specific type
func RetrievePresets(effectType string) (interface{}, error) {
	cfg := config.Get()

	if effectType == "all" {
		return model.PresetCollection{
			ParticleEffectPresets:  particlePresetsToAPI(cfg.ParticleEffectPresets),
			DragonEffectPresets:    cfg.DragonEffectPresets,
			TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
			PotionEffectPresets:    cfg.PotionEffectPresets,
			LaserEffectPresets:     cfg.LaserEffectPresets,
			CommandEffectPresets:   commandPresetsToAPI(cfg.CommandEffectPresets),
			LightningEffectPresets: lightningPresetsToAPI(cfg.LightningEffectPresets),
		}, nil
	}

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		return particlePresetsToAPI(cfg.ParticleEffectPresets), nil
	case model.DragonEffectType:
		return cfg.DragonEffectPresets, nil
	case model.TimeshiftEffectType:
		return cfg.TimeshiftEffectPresets, nil
	case model.PotionEffectType:
		return cfg.PotionEffectPresets, nil
	case model.LaserEffectType:
		return cfg.LaserEffectPresets, nil
	case model.CommandEffectType:
		return commandPresetsToAPI(cfg.CommandEffectPresets), nil
	case model.LightningEffectType:
		return lightningPresetsToAPI(cfg.LightningEffectPresets), nil
	default:
		return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
	}
}

// TestPresetAPI runs a preset on the server for three seconds
func TestPresetAPI(effectType string, body []byte) {
	id := uuid.New().String()

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		preset := model.ParticleEffectPresetAPI{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunParticleEffect(preset.FromAPI(), model.StartEffectAction, false)
	case model.DragonEffectType:
		preset := model.DragonEffectPreset{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunDragonEffect(preset, model.StartEffectAction, false)
	case model.TimeshiftEffectType:
		preset := model.TimeshiftEffectPreset{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunTimeshiftEffect(preset, model.StartEffectAction, false)
	case model.PotionEffectType:
		preset := model.PotionEffectPreset{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunPotionEffect(preset, model.StartEffectAction, false)
	case model.LaserEffectType:
		preset := model.LaserEffectPreset{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunLaserEffect(preset, model.StartEffectAction, false)
	case model.CommandEffectType:
		preset := model.CommandEffectPresetAPI{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunCommandEffect(preset.FromAPI(), false)
	case model.LightningEffectType:
		preset := model.LightningEffectPresetAPI{}
		json.Unmarshal(body, &preset)
		preset.ID = id
		manager.RunLightningEffect(preset.FromAPI(), model.StartEffectAction, false)
	}

	if model.EffectType(effectType) != model.CommandEffectType {
		time.Sleep(3 * time.Second)
		manager.StopEffect(id, false)
	}
}

func particlePresetsToAPI(presets []model.ParticleEffectPreset) (migrated []model.ParticleEffectPresetAPI) {
	migrated = []model.ParticleEffectPresetAPI{}
	for _, p := range presets {
		migrated = append(migrated, p.ToAPI())
	}
	return
}

// temporary measures until the preset manager has been fully migrated to React
func commandPresetsToAPI(presets []model.CommandEffectPreset) (migrated []model.CommandEffectPresetAPI) {
	migrated = []model.CommandEffectPresetAPI{}
	for _, p := range presets {
		migrated = append(migrated, p.ToAPI())
	}
	return
}

func lightningPresetsToAPI(presets []model.LightningEffectPreset) (migrated []model.LightningEffectPresetAPI) {
	migrated = []model.LightningEffectPresetAPI{}
	for _, p := range presets {
		migrated = append(migrated, p.ToAPI())
	}
	return
}

func migrateLaserPreset(preset *model.LaserEffectPreset) {
	if preset.IsEndLaser {
		preset.LaserType = model.EndLaserType
	} else {
		if preset.IsNonPlayerTargeting {
			preset.LaserType = model.NonTargetingGuardianLaserType
		} else {
			preset.LaserType = model.TargetingGuardianLaserType
		}
	}
}
