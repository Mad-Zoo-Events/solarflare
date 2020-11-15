package controller

import (
	"encoding/json"
	"net/url"
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
		preset := model.ParticleEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling particle effect preset request", err)
		}

		return manager.UpsertParticleEffectPreset(preset)
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
		preset := model.CommandEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling command effect preset request", err)
		}

		return manager.UpsertCommandEffectPreset(preset)
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// UpsertPresetUI inserts a new preset or updates an existing one from a UI request
func UpsertPresetUI(effectType string, values url.Values) (*string, error) {
	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		preset := model.ParticleEffectPreset{}

		if err := unmarshalParticlePreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertParticleEffectPreset(preset)
	case model.DragonEffectType:
		preset := model.DragonEffectPreset{}

		if err := unmarshalDragonPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertDragonEffectPreset(preset)
	case model.TimeshiftEffectType:
		preset := model.TimeshiftEffectPreset{}

		if err := unmarshalTimeshiftPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertTimeshiftEffectPreset(preset)
	case model.PotionEffectType:
		preset := model.PotionEffectPreset{}

		if err := unmarshalPotionPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertPotionEffectPreset(preset)
	case model.LaserEffectType:
		preset := model.LaserEffectPreset{}

		if err := unmarshalLaserPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertLaserEffectPreset(preset)
	case model.CommandEffectType:
		preset := model.CommandEffectPreset{}

		if err := unmarshalCommandPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertCommandEffectPreset(preset)
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
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// TestPreset runs a preset from a UI request for three seconds
func TestPreset(effectType string, values url.Values) error {
	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		preset := model.ParticleEffectPreset{}
		if err := unmarshalParticlePreset(&preset, values); err != nil {
			return err
		}
		preset.ID = uuid.New().String()

		if err := manager.RunParticleEffect(preset, model.StartEffectAction, false); err == nil {
			time.Sleep(3 * time.Second)
			return manager.StopEffect(preset.ID, false)
		}
	case model.DragonEffectType:
		preset := model.DragonEffectPreset{}
		if err := unmarshalDragonPreset(&preset, values); err != nil {
			return err
		}
		preset.ID = uuid.New().String()

		if err := manager.RunDragonEffect(preset, model.StartEffectAction, false); err == nil {
			time.Sleep(3 * time.Second)
			return manager.StopEffect(preset.ID, false)
		}
	case model.TimeshiftEffectType:
		preset := model.TimeshiftEffectPreset{}
		if err := unmarshalTimeshiftPreset(&preset, values); err != nil {
			return err
		}
		preset.ID = uuid.New().String()

		if err := manager.RunTimeshiftEffect(preset, model.StartEffectAction, false); err == nil {
			time.Sleep(3 * time.Second)
			return manager.StopEffect(preset.ID, false)
		}
	case model.PotionEffectType:
		preset := model.PotionEffectPreset{}
		if err := unmarshalPotionPreset(&preset, values); err != nil {
			return err
		}
		preset.ID = uuid.New().String()

		if err := manager.RunPotionEffect(preset, model.StartEffectAction, false); err == nil {
			time.Sleep(3 * time.Second)
			return manager.StopEffect(preset.ID, false)
		}
	case model.LaserEffectType:
		preset := model.LaserEffectPreset{}
		if err := unmarshalLaserPreset(&preset, values); err != nil {
			return err
		}
		preset.ID = uuid.New().String()

		if err := manager.RunLaserEffect(preset, model.StartEffectAction, false); err == nil {
			time.Sleep(3 * time.Second)
			return manager.StopEffect(preset.ID, false)
		}
	case model.CommandEffectType:
		preset := model.CommandEffectPreset{}
		if err := unmarshalCommandPreset(&preset, values); err != nil {
			return err
		}

		return manager.RunCommandEffect(preset, false)
	}

	return sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// RetrievePresets retrieves all preset of a specific type
func RetrievePresets(effectType string) (interface{}, error) {
	cfg := config.Get()

	if effectType == "all" {
		return model.PresetCollection{
			ParticleEffectPresets:  cfg.ParticleEffectPresets,
			DragonEffectPresets:    cfg.DragonEffectPresets,
			CommandEffectPresets:   cfg.CommandEffectPresets,
			LaserEffectPresets:     cfg.LaserEffectPresets,
			PotionEffectPresets:    cfg.PotionEffectPresets,
			TimeshiftEffectPresets: cfg.TimeshiftEffectPresets,
		}, nil
	}

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		return cfg.ParticleEffectPresets, nil
	case model.DragonEffectType:
		return cfg.DragonEffectPresets, nil
	case model.TimeshiftEffectType:
		return cfg.TimeshiftEffectPresets, nil
	case model.PotionEffectType:
		return cfg.PotionEffectPresets, nil
	case model.LaserEffectType:
		return cfg.LaserEffectPresets, nil
	case model.CommandEffectType:
		return cfg.LaserEffectPresets, nil
	default:
		return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
	}
}
