package controller

import (
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
)

// GetStatus returns information on the service and network status
func GetStatus() model.StatusResponse {
	cfg := config.Get()

	return model.StatusResponse{
		RegisteredServerCount: len(cfg.Servers),
	}
}
