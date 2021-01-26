package controller

import (
	"fmt"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// StartStopInstance handles starting or stopping an instance
func StartStopInstance(action model.InstanceAction) error {
	if action == model.StartInstanceAction {
		return manager.StartBuildInstance()
	}
	if action == model.StopInstanceAction {
		return manager.StopBuildInstance()
	}

	return sferror.New(sferror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed on an instance", action), nil)
}
