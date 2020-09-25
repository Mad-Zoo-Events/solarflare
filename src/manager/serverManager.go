package manager

import (
	"github.com/google/uuid"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
)

// UpsertServer creates or updates a server entry in the database
func UpsertServer(server model.Server) (*string, error) {
	if server.ID == "" {
		server.ID = uuid.New().String()
	}

	err := client.UpsertItem(client.ServerTable, server)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.Servers = client.GetServers()

	return &server.ID, nil
}
