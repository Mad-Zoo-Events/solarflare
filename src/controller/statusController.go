package controller

import (
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/clock"
)

// GetStatus returns information on the service and network status
func GetStatus() model.StatusResponse {
	cfg := config.Get()
	bpm, multiplier := clock.GetSpeed()

	return model.StatusResponse{
		RegisteredServerCount: len(cfg.Servers),
		ClockSpeedBPM:         bpm,
		ClockSpeedMultiplier:  multiplier,
	}
}
