package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
)

const (
	pollingTimeout  = 5 * time.Minute
	pollingInterval = 3 * time.Second
)

// StartInstance starts the instance and sends status updates to the UI until it's running
func StartInstance(id string) error {
	if err := client.StartInstance(id); err != nil {
		return err
	}

	updateStatus(id, model.InstanceStatusPending)

	go pollForUpdates(id)

	return nil
}

// StopInstance stops the instance and sends status updates to the UI until it's stopped
func StopInstance(id string) error {
	if err := client.StopInstance(id); err != nil {
		return err
	}

	updateStatus(id, model.InstanceStatusStopping)

	go pollForUpdates(id)

	return nil
}

func pollForUpdates(id string) {
	startTime := time.Now()
	var prevStatus model.InstanceStatus

	for {
		time.Sleep(pollingInterval)

		if time.Now().Sub(startTime) > pollingTimeout {
			updateStatus(id, model.InstanceStatusUnknown)
			return
		}

		status, _ := client.GetStatus(id)
		if status != prevStatus {
			updateStatus(id, status)

			if status == model.InstanceStatusStopped ||
				status == model.InstanceStatusRunning {
				return
			}
		}

		prevStatus = status
	}
}

func updateStatus(id string, status model.InstanceStatus) {
	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.ID == id {
			server.InstanceStatus = status
			UpsertServer(server)
		}
	}
	update := model.UIUpdate{
		ServerUpdate: &model.ServerUpdate{
			Servers: cfg.Servers,
		},
	}

	SendUIUpdate(update)
}

// UpsertServer creates or updates a server entry in the database
func UpsertServer(server model.Server) (*string, error) {
	err := client.UpsertItem(client.ServerTable, server)
	if err != nil {
		return nil, err
	}

	cfg := config.Get()
	cfg.Servers = client.GetServers(false)

	return &server.ID, nil
}
