package controller

import (
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
		StatusUpdate: &model.StatusUpdate{
			ActiveServerIDs: getActiveServerIDs(),
		},
	}

	manager.SendUIUpdate(update)

	return nil
}
