package manager

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
)

// UpsertParticleEffectPreset creates or updates a particle effect preset in the database
func UpsertParticleEffectPreset(preset model.ParticleEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.ParticleEffectPresetsTable, client.CurrentEvent), preset)
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

	err := client.UpsertItem(fmt.Sprintf(client.DragonEffectPresetsTable, client.CurrentEvent), preset)
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

	err := client.UpsertItem(fmt.Sprintf(client.TimeshiftEffectPresetsTable, client.CurrentEvent), preset)
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

	err := client.UpsertItem(fmt.Sprintf(client.PotionEffectPresetsTable, client.CurrentEvent), preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.PotionEffectPresets = client.GetPotionEffectPresets()

	return &preset.ID, nil
}

// UpsertLaserEffectPreset creates or updates a laser effect preset in the database
func UpsertLaserEffectPreset(preset model.LaserEffectPreset) (*string, error) {
	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.LaserEffectPresetsTable, client.CurrentEvent), preset)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.LaserEffectPresets = client.GetLaserEffectPresets()

	return &preset.ID, nil
}

// DeletePreset deletes a preset from the database
func DeletePreset(tableName, id string) error {
	return client.DeleteItem(tableName, id)
}
