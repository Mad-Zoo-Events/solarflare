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

// EnableDisableServer turns a server on or off
func EnableDisableServer(id string, action model.ServerAction) error {
	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.ID == id {
			if action == model.EnableServerAction {
				server.IsActive = true
			} else {
				server.IsActive = false
			}

			_, err := UpsertServer(server)
			if err != nil {
				return err
			}
		}
	}

	sendServerUpdate(action)

	return nil
}

// StartStopServer starts or stops the instance and sends status updates to the UI until it's running/stopped
func StartStopServer(id string, action model.ServerAction) error {
	if action == model.StartServerAction {
		if err := client.StartInstance(id); err != nil {
			return err
		}

		updateInstanceStatus(id, model.InstanceStatusPending)
		sendServerUpdate(action)
	} else {
		if err := client.StopInstance(id); err != nil {
			return err
		}

		updateInstanceStatus(id, model.InstanceStatusStopping)
		sendServerUpdate(action)
	}

	go pollForUpdates(id, action)

	return nil
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

func pollForUpdates(id string, action model.ServerAction) {
	startTime := time.Now()
	var prevStatus model.InstanceStatus

	for {
		time.Sleep(pollingInterval)

		if time.Now().Sub(startTime) > pollingTimeout {
			updateInstanceStatus(id, model.InstanceStatusUnknown)
			sendServerUpdate(action)
			return
		}

		status, _ := client.GetStatus(id)
		if status != prevStatus {
			updateInstanceStatus(id, status)
			sendServerUpdate(action)

			if status == model.InstanceStatusStopped ||
				status == model.InstanceStatusRunning {
				return
			}
		}

		prevStatus = status
	}
}

func updateInstanceStatus(id string, status model.InstanceStatus) {
	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.ID == id {
			server.InstanceStatus = status
			UpsertServer(server)
		}
	}
}

func sendServerUpdate(action model.ServerAction) {
	cfg := config.Get()
	update := model.UIUpdate{
		ServerUpdate: &model.ServerUpdate{
			Action:  action,
			Servers: cfg.Servers,
		},
	}

	SendUIUpdate(update)
}
