package controller

import (
	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
)

// GetStatus returns information on the service and network status
func GetStatus() model.InboundStatusResponse {
	cfg := config.Get()

	return model.InboundStatusResponse{
		RegisteredServerCount: len(cfg.Servers),
	}
}
