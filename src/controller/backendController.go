package controller

import (
	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
)

// ToggleServer turns a server on or off
func ToggleServer(id string, action model.ServerAction) error {
	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.ID == id {
			if action == model.EnableServerAction {
				server.IsActive = true
			} else {
				server.IsActive = false
			}

			_, err := manager.UpsertServer(server)
			if err != nil {
				return err
			}
		}
	}

	update := model.UIUpdate{
		ServerUpdate: &model.ServerUpdate{
			Servers: cfg.Servers,
		},
	}

	manager.SendUIUpdate(update)

	return nil
}

// SelectStage selects a different data source for presets and reloads
func SelectStage(stage string) {
	cfg := config.Get()

	if !contains(cfg.Stages, stage) {
		return
	}

	cfg.SelectedStage = stage

	client.ReloadAllPresets()

	update := model.UIUpdate{
		StageUpdate: &model.StageUpdate{
			Stages:        cfg.Stages,
			SelectedStage: stage,
		},
	}

	manager.SendUIUpdate(update)
}

// SetSetting sets a specific user setting on the database
func SetSetting(key string, value string) error {
	setting := model.Setting{
		Key:   key,
		Value: value,
	}

	return client.UpsertItem(client.SettingsTable, setting)
}

// GetSetting gets a specific user setting from the database
func GetSetting(key string) (string, error) {
	setting, err := client.GetSetting(key)
	if err != nil {
		return "", err
	}
	return (*setting).Value, nil
}
