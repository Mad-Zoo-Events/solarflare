package client

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/eynorey/candyshop/src/config"
)

// SendEffectRequest send a effect request to all registeres eyecandy instances
func SendEffectRequest(endpoint string, request interface{}) error {
	body, err := json.Marshal(request)
	if err != nil {
		log.Printf("Failed to marshal request: %s", err.Error())
		return err
	}

	c := http.Client{
		Timeout: time.Duration(5 * time.Second),
	}
	cfg := config.Get()
	for _, server := range cfg.Servers {
		url := server.Address + endpoint
		go send(c, http.MethodPost, url, body)
	}

	return nil
}

func send(c http.Client, method string, url string, body []byte) {
	request, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		log.Printf("Error compiling request to Eyecandy: %s", err.Error())
	}

	response, err := c.Do(request)
	if err != nil {
		log.Printf("Error sending request to Eyecandy: %s", err.Error())
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		log.Printf("Error received from Eyecandy: %s", string(responseMessage))
	}
}
