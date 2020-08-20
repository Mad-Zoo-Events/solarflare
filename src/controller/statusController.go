package controller

import (
	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
)

// GetStatus returns information on the service and network status
func GetStatus() model.StatusResponse {
	cfg := config.Get()
	bpm, multiplier := manager.GetClockSpeed()

	return model.StatusResponse{
		RegisteredServerCount: len(cfg.Servers),
		ClockSpeedBPM:         bpm,
		ClockSpeedMultiplier:  multiplier,
	}
}

// ReloadServerList triggers a reload of the server list
func ReloadServerList() {
	cfg := config.Get()
	cfg.Servers = client.GetServers()

	update := model.UIUpdate{
		StatusUpdate: &model.StatusUpdate{
			RegisteredServerCount: len(cfg.Servers),
		},
	}

	manager.SendUIUpdate(update)
}
