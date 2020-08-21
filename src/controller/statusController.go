package controller

import (
	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
)

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
