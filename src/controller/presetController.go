package controller

import (
	"encoding/json"
	"net/url"

	"github.com/eynorey/candyshop/src/manager"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// UpsertPresetAPI inserts a new preset or updates an existing one from an API request
func UpsertPresetAPI(effectType model.EffectType, body []byte) (*string, error) {
	switch effectType {
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

	return nil, cserror.New(cserror.Internal, "Invalid effect type: "+string(effectType), nil)
}

// UpsertPresetUI inserts a new preset or updates an existing one from a UI request
func UpsertPresetUI(effectType model.EffectType, values url.Values) (*string, error) {
	switch effectType {
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

	return nil, cserror.New(cserror.Internal, "Invalid effect type: "+string(effectType), nil)
}
