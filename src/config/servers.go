package config

import (
	"github.com/eynorey/candyshop/src/model"
)

func loadServers() []model.Server {
	return []model.Server{
		model.Server{
			Address: "http://3.22.232.137:8001/",
			Token:   "",
		},
	}
}
