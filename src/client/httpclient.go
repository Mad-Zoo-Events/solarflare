package client

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
)

const baseURL = "http://3.22.232.137:8001/"

// Do does what do does
func Do(method string, endpoint string, request interface{}) error {
	url := baseURL + endpoint

	body, err := json.Marshal(request)
	if err != nil {
		log.Printf("Failed to marshal request: %s", err.Error())
		return err
	}

	r, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	client := http.Client{}
	response, err := client.Do(r)
	if err != nil {
		return err
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		return errors.New("Error received from eyecandy: " + string(responseMessage))
	}

	return nil
}
