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
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.ParticleEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetParticleEffectPresets(client.GetParticleEffectPresets())

	return &preset.ID, nil
}

// UpsertDragonEffectPreset creates or updates a dragon effect preset in the database
func UpsertDragonEffectPreset(preset model.DragonEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.DragonEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetDragonEffectPresets(client.GetDragonEffectPresets())

	return &preset.ID, nil
}

// UpsertTimeshiftEffectPreset creates or updates a timeshift effect preset in the database
func UpsertTimeshiftEffectPreset(preset model.TimeshiftEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.TimeshiftEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetTimeshiftEffectPresets(client.GetTimeshiftEffectPresets())

	return &preset.ID, nil
}

// UpsertPotionEffectPreset creates or updates a potion effect preset in the database
func UpsertPotionEffectPreset(preset model.PotionEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.PotionEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetPotionEffectPresets(client.GetPotionEffectPresets())

	return &preset.ID, nil
}

// UpsertLaserEffectPreset creates or updates a laser effect preset in the database
func UpsertLaserEffectPreset(preset model.LaserEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	if preset.IsEndLaser {
		preset.IsNonPlayerTargeting = true
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.LaserEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetLaserEffectPresets(client.GetLaserEffectPresets())

	return &preset.ID, nil
}

// UpsertCommandEffectPreset creates or updates a command effect preset in the database
func UpsertCommandEffectPreset(preset model.CommandEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.CommandEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetCommandEffectPresets(client.GetCommandEffectPresets())

	return &preset.ID, nil
}

// UpsertLightningEffectPreset creates or updates a lightning effect preset in the database
func UpsertLightningEffectPreset(preset model.LightningEffectPreset) (*string, error) {
	cfg := config.Get()

	if preset.ID == "" {
		preset.ID = uuid.New().String()
	}

	err := client.UpsertItem(fmt.Sprintf(client.EffectPresetsTable, "%s", model.LightningEffectType), preset)
	if err != nil {
		return nil, err
	}

	cfg.SetLightningEffectPresets(client.GetLightningEffectPresets())

	return &preset.ID, nil
}

// DeletePreset deletes a preset from the database
func DeletePreset(tableName, id string) error {
	return client.DeleteItem(tableName, id)
}
