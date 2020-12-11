package controller

import (
	"github.com/go-playground/form/v4"

	"github.com/eynorey/solarflare/src/config"
)

var decoder *form.Decoder

func init() {
	decoder = form.NewDecoder()
}

func getActiveServerIDs() []string {
	activeServerIDs := []string{}

	cfg := config.Get()
	for _, server := range cfg.Servers {
		if server.IsActive {
			activeServerIDs = append(activeServerIDs, server.ID)
		}
	}

	return activeServerIDs
}

func contains(arr []string, str string) bool {
	for _, e := range arr {
		if e == str {
			return true
		}
	}
	return false
}
