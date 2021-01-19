package controller

import (
	"encoding/json"
	"strings"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// RunSingleCommand runs a console command
func RunSingleCommand(body []byte) error {
	commandRequest := &struct {
		Command string `json:"command"`
	}{}
	if err := json.Unmarshal(body, &commandRequest); err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from the command request", err)
	}

	commandRequest.Command = strings.TrimPrefix(commandRequest.Command, "/")

	if commandRequest.Command == "" {
		return sferror.New(sferror.BadRequest, "Empty command", nil)
	}

	return manager.RunSingleCommand(commandRequest.Command)
}
