package controller

import (
	"fmt"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// StageSettingKey is the key used for setting the stage
const StageSettingKey = "stage"

// ManageServer handles actions to be performed on an instance
func ManageServer(id string, action model.ServerAction) error {
	switch action {
	case model.EnableServerAction, model.DisableServerAction:
		return manager.EnableDisableServer(id, action)
	case model.StartServerAction, model.StopServerAction:
		return manager.StartStopServer(id, action)
	default:
		return sferror.New(sferror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed on an instance", action), nil)
	}
}

// SetSetting sets a specific user setting on the database
func SetSetting(key string, value string) error {
	if key == StageSettingKey {
		if err := selectStage(value); err != nil {
			return err
		}
	}

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

// selects a different data source for presets and reloads
func selectStage(stage string) error {
	cfg := config.Get()

	if !contains(cfg.Stages, stage) {
		return sferror.New(sferror.StageNotFound, fmt.Sprintf("Stage %s does not exist", stage), nil)
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

	return nil
}
