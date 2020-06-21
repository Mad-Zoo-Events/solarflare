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
func UpsertTimeshiftEffectPreset(preset model.TimeshiftEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertEffectPreset(client.TimeshiftEffectPresetsTable, preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.TimeshiftEffectPresets = client.GetTimeshiftEffectPresets()

	return &preset.ID, nil
}

// UpsertPotionEffectPreset creates or updates a potion effect preset in the database
func UpsertPotionEffectPreset(preset model.PotionEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertEffectPreset(client.PotionEffectPresetsTable, preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.PotionEffectPresets = client.GetPotionEffectPresets()

	return &preset.ID, nil
}

// DeletePreset deletes a preset from the database
func DeletePreset(tableName, id string) error {
	return client.DeleteEffectPreset(tableName, id)
}
