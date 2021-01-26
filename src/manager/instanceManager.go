package manager

import (
	"time"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
)

const (
	pollingTimeout  = 5 * time.Minute
	pollingInterval = 3 * time.Second
)

// BuildInstanceID temporary
// TODO: obviously.
const BuildInstanceID = "i-076fb9703cc06603c"

// StartBuildInstance starts the build instance and sends status updates to the UI until it's running
func StartBuildInstance() error {
	if err := client.StartInstance(BuildInstanceID); err != nil {
		return err
	}

	sendInstanceUpdate(model.InstanceStatusPending)

	go pollForUpdates()

	return nil
}

// StopBuildInstance stops the build instance and sends status updates to the UI until it's running
func StopBuildInstance() error {
	if err := client.StopInstance(BuildInstanceID); err != nil {
		return err
	}

	sendInstanceUpdate(model.InstanceStatusStopping)

	go pollForUpdates()

	return nil
}

func pollForUpdates() {
	startTime := time.Now()
	for {
		if time.Now().Sub(startTime) > pollingTimeout {
			sendInstanceUpdate(model.InstanceStatusUnknown)
			return
		}

		time.Sleep(pollingInterval)

		status, _ := client.GetStatus(BuildInstanceID)
		if status != model.InstanceStatusPending &&
			status != model.InstanceStatusStopping {

			sendInstanceUpdate(status)
			return
		}
	}
}

func sendInstanceUpdate(status model.InstanceStatus) {
	update := model.UIUpdate{
		InstanceUpdate: &model.InstanceUpdate{
			Status: status,
		},
	}

	SendUIUpdate(update)
}
