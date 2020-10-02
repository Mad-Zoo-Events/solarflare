package controller

import (
	"encoding/json"
	"net/url"

	"github.com/eynorey/solarflare/src/utils"

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
			cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
		}
	case model.DragonEffectType:
		err = client.DeleteItem(client.DragonEffectPresetsTable, id)
		if err == nil {
			cfg.DragonEffectPresets = client.GetDragonEffectPresets()
		}
	case model.TimeshiftEffectType:
		err = client.DeleteItem(client.TimeshiftEffectPresetsTable, id)
		if err == nil {
			cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
		}
	case model.PotionEffectType:
		err = client.DeleteItem(client.PotionEffectPresetsTable, id)
		if err == nil {
			cfg.PotionEffectPresets = client.GetPotionEffectPresets()
		}
	case model.LaserEffectType:
		err = client.DeleteItem(client.LaserEffectPresetsTable, id)
		if err == nil {
			cfg.LaserEffectPresets = client.GetLaserEffectPresets()
		}
	default:
		err = sferror.New(sferror.InvalidEffectType, effectType, nil)
	}

	return err
}

// DuplicatePreset duplicates a preset and reloads
func DuplicatePreset(effectType, id string) error {
	preset, err := utils.FindPreset(id, model.EffectType(effectType))
	if err != nil {
		return err
	}

	switch model.EffectType(effectType) {
	case model.ParticleEffectType:
		p := preset.(model.ParticleEffectPreset)
		p.ID = ""
		_, err = manager.UpsertParticleEffectPreset(p)
	case model.DragonEffectType:
		p := preset.(model.DragonEffectPreset)
		p.ID = ""
		_, err = manager.UpsertDragonEffectPreset(p)
	case model.TimeshiftEffectType:
		p := preset.(model.TimeshiftEffectPreset)
		p.ID = ""
		_, err = manager.UpsertTimeshiftEffectPreset(p)
	case model.PotionEffectType:
		p := preset.(model.PotionEffectPreset)
		p.ID = ""
		_, err = manager.UpsertPotionEffectPreset(p)
	case model.LaserEffectType:
		p := preset.(model.LaserEffectPreset)
		p.ID = ""
		_, err = manager.UpsertLaserEffectPreset(p)
	default:
		err = sferror.New(sferror.InvalidEffectType, effectType, nil)
	}

	return err
}
