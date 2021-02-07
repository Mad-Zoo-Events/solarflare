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

	sendServerUpdate(id, action)

	return nil
}

// StartStopServer starts or stops the instance and sends status updates to the UI until it's running/stopped
func StartStopServer(id string, action model.ServerAction) error {
	var initialStatus model.InstanceStatus
	if action == model.StartServerAction {
		if err := client.StartInstance(id); err != nil {
			return err
		}

		initialStatus = model.InstanceStatusPending
	} else {
		if err := client.StopInstance(id); err != nil {
			return err
		}

		initialStatus = model.InstanceStatusStopping
	}

	updateInstanceStatus(id, initialStatus)
	sendServerUpdate(id, action)

	go pollForUpdates(id, action, initialStatus)

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

func pollForUpdates(id string, action model.ServerAction, prevStatus model.InstanceStatus) {
	startTime := time.Now()

	for {
		time.Sleep(pollingInterval)

		if time.Now().Sub(startTime) > pollingTimeout {
			updateInstanceStatus(id, model.InstanceStatusUnknown)
			sendServerUpdate(id, action)
			return
		}

		status, _ := client.GetStatus(id)
		if status != prevStatus {
			updateInstanceStatus(id, status)
			sendServerUpdate(id, action)

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

func sendServerUpdate(id string, action model.ServerAction) {
	cfg := config.Get()
	update := model.UIUpdate{
		ServerUpdate: &model.ServerUpdate{
			ActionPerformed: action,
			PerformedOnID:   id,
			Servers:         cfg.Servers,
		},
	}

	SendUIUpdate(update)
}
