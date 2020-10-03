package controller

import (
	"encoding/json"
	"net/url"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const commandsEndpoint = "/commands"

// RunCommand runs a console command
func RunCommand(values url.Values) error {
	commandRequest := model.CommandRequest{}
	err := decoder.Decode(&commandRequest, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from the command request", err)
	}

	body, err := json.Marshal(commandRequest)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	return client.ExecuteEffect(commandsEndpoint, body)
}
