package controller

import (
	"net/url"
	"strings"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const commandsEndpoint = "/commands"

// RunCommand runs a console command
func RunCommand(values url.Values) (err error) {
	commandRequest := model.CommandRequest{}
	err = decoder.Decode(&commandRequest, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from the command request", err)
	}

	commandRequest.Command = strings.TrimPrefix(commandRequest.Command, "/")

	defer sendCommandUpdate(commandRequest.Command, &err)

	if commandRequest.Command == "" {
		err = sferror.New(sferror.BadRequest, "Empty command", nil)
		return
	}

	err = client.ExecuteEffect(commandsEndpoint, []byte(commandRequest.Command))

	return
}

func sendCommandUpdate(command string, e *error) {
	err := *e
	update := model.UIUpdate{
		CommandUpdate: &model.CommandUpdate{
			Command: command,
		},
	}

	if err != nil {
		update.CommandUpdate.ErrorMessage = err.Error()
	}

	manager.SendUIUpdate(update)
}
