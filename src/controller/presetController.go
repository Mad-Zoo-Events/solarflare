package controller

import (
	"encoding/json"

	"github.com/google/uuid"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// UpsertParticleEffectPreset stores a new particle effect preset in the database
func UpsertParticleEffectPreset(request []byte) (*string, error) {
	preset := model.ParticleEffectPreset{}
	err := json.Unmarshal(request, &preset)
	if err != nil {
		return nil, cserror.New(cserror.Encoding, "Error unmarshalling particle effect preset request", err)
	}

	// TODO: Input validation

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err = client.UpsertParticleEffectPreset(preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.ParticleEffectPresets = client.GetParticleEffectPresets()

	return &preset.ID, nil
}

// UpsertDragonEffectPreset stores a new dragon effect preset in the database
func UpsertDragonEffectPreset(request []byte) (*string, error) {
	preset := model.DragonEffectPreset{}
	err := json.Unmarshal(request, &preset)
	if err != nil {
		return nil, cserror.New(cserror.Encoding, "Error unmarshalling dragon effect preset request", err)
	}

	// TODO: Input validation

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err = client.UpsertDragonEffectPreset(preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.DragonEffectPresets = client.GetDragonEffectPresets()

	return &preset.ID, nil
}

// DeletePreset deletes a preset from the database and reloads
func DeletePreset(effectType model.EffectType, id string) error {
	cfg := config.Get()

	var err error

	switch effectType {
	case model.EffectTypeParticleEffect:
		err = client.DeleteParticleEffectPreset(id)
		if err == nil {
			cfg.ParticleEffectPresets = client.GetParticleEffectPresets()
		}
	case model.EffectTypeDragon:
		err = client.DeleteDragonEffectPreset(id)
		if err == nil {
			cfg.DragonEffectPresets = client.GetDragonEffectPresets()
		}
	}

	return err
}
