package manager

import (
	"github.com/google/uuid"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// UpsertParticleEffectPreset stores a new particle effect preset in the database
func UpsertParticleEffectPreset(preset model.ParticleEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertEffectPreset(client.ParticleEffectPresetsTable, preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.ParticleEffectPresets = client.GetParticleEffectPresets()

	return &preset.ID, nil
}

// UpsertDragonEffectPreset stores a new dragon effect preset in the database
func UpsertDragonEffectPreset(preset model.DragonEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertEffectPreset(client.DragonEffectPresetsTable, preset)
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
	}

	return err
}
