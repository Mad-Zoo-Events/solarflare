package controller

import (
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// GetStatus returns information on the service and network status
func GetStatus() model.StatusResponse {
	cfg := config.Get()

	return model.StatusResponse{
		RegisteredServerCount: len(cfg.Servers),
	}
}
