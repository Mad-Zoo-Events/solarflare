package controller

import (
	"encoding/json"
	"net/url"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/manager"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// UpsertPresetAPI inserts a new preset or updates an existing one from an API request
func UpsertPresetAPI(effectType string, body []byte) (*string, error) {
	switch model.EffectType(effectType) {
	case model.EffectTypeParticle:
		preset := model.ParticleEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, cserror.New(cserror.Encoding, "Error unmarshalling particle effect preset request", err)
		}

		return manager.UpsertParticleEffectPreset(preset)
	case model.EffectTypeDragon:
		preset := model.DragonEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, cserror.New(cserror.Encoding, "Error unmarshalling dragon effect preset request", err)
		}

		return manager.UpsertDragonEffectPreset(preset)
	case model.EffectTypeTimeshift:
		preset := model.TimeshiftEffectPreset{}

		if err := json.Unmarshal(body, &preset); err != nil {
			return nil, cserror.New(cserror.Encoding, "Error unmarshalling timeshift effect preset request", err)
		}

		return manager.UpsertTimeshiftEffectPreset(preset)
	}

	return nil, cserror.New(cserror.InvalidEffectType, effectType, nil)
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
	}

	return nil, cserror.New(cserror.InvalidEffectType, effectType, nil)
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
	default:
		err = cserror.New(cserror.InvalidEffectType, effectType, nil)
	}

	return err
}
