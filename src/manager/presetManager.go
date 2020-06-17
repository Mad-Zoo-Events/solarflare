package manager

import (
	"github.com/google/uuid"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// UpsertParticleEffectPreset creates or updates a particle effect preset in the database
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

// UpsertDragonEffectPreset creates or updates a dragon effect preset in the database
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

// UpsertTimeshiftEffectPreset creates or updates a timeshift effect preset in the database
func UpsertTimeshiftEffectPreset(preset model.DragonEffectPreset) (*string, error) {
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
	case model.EffectTypeTimeshift:
		err = client.DeleteEffectPreset(client.TimeshiftEffectPresetsTable, id)
		if err == nil {
			cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()
		}
	}

	return err
}
