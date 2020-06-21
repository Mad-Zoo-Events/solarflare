package controller

import (
	"encoding/json"
	"net/url"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// UpsertPresetAPI inserts a new preset or updates an existing one from an API request
func UpsertPresetAPI(effectType string, body []byte) (*string, error) {
	switch model.EffectType(effectType) {
	case model.EffectTypeParticle:
		preset := model.ParticleEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling particle effect preset request", err)
		}

		return manager.UpsertParticleEffectPreset(preset)
	case model.EffectTypeDragon:
		preset := model.DragonEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling dragon effect preset request", err)
		}

		return manager.UpsertDragonEffectPreset(preset)
	case model.EffectTypeTimeshift:
		preset := model.TimeshiftEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling timeshift effect preset request", err)
		}

		return manager.UpsertTimeshiftEffectPreset(preset)
	case model.EffectTypePotion:
		preset := model.PotionEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, sferror.New(sferror.Encoding, "Error unmarshalling potion effect preset request", err)
		}

		return manager.UpsertPotionEffectPreset(preset)
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// UpsertPresetUI inserts a new preset or updates an existing one from a UI request
func UpsertPresetUI(effectType string, values url.Values) (*string, error) {
	switch model.EffectType(effectType) {
	case model.EffectTypeParticle:
		preset := model.ParticleEffectPreset{}

		if err := unmarshalParticlePreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertParticleEffectPreset(preset)
	case model.EffectTypeDragon:
		preset := model.DragonEffectPreset{}

		if err := unmarshalDragonPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertDragonEffectPreset(preset)
	case model.EffectTypeTimeshift:
		preset := model.TimeshiftEffectPreset{}

		if err := unmarshalTimeshiftPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertTimeshiftEffectPreset(preset)
	case model.EffectTypePotion:
		preset := model.PotionEffectPreset{}

		if err := unmarshalPotionPreset(&preset, values); err != nil {
			return nil, err
		}

		return manager.UpsertPotionEffectPreset(preset)
	}

	return nil, sferror.New(sferror.InvalidEffectType, effectType, nil)
}

// DeletePreset deletes a preset and reloads
func DeletePreset(effectType, id string) error {
	cfg := config.Get()
	var err error

	switch model.EffectType(effectType) {
	case model.EffectTypeParticle:
		err = client.DeleteEffectPreset(client.ParticleEffectPresetsTable, id)
		if err == nil {
			cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
		}
	case model.EffectTypeDragon:
		err = client.DeleteEffectPreset(client.DragonEffectPresetsTable, id)
		if err == nil {
			cfg.DragonEffectPresets = client.GetDragonEffectPresets()
		}
	case model.EffectTypeTimeshift:
		err = client.DeleteEffectPreset(client.TimeshiftEffectPresetsTable, id)
		if err == nil {
			cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
		}
	case model.EffectTypePotion:
		err = client.DeleteEffectPreset(client.PotionEffectPresetsTable, id)
		if err == nil {
			cfg.PotionEffectPresets = client.GetPotionEffectPresets()
		}
	default:
		err = sferror.New(sferror.InvalidEffectType, effectType, nil)
	}

	return err
}
