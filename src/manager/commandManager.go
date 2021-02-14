package manager

import (
	"encoding/json"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// RunSingleCommand compiles request for running a single command and executes it on all servers
func RunSingleCommand(command string) error {
	body, err := json.Marshal([]string{command})
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	err = client.ExecuteEffect(commandsEndpoint, body)

	update := model.UIUpdate{
		CommandUpdate: &model.CommandUpdate{
			Command: command,
		},
	}

	if err != nil {
		update.CommandUpdate.ErrorMessage = err.Error()
	}

	SendUIUpdate(update)

	return err
}
