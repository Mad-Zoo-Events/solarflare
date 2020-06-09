package client

import (
	"bytes"
	"errors"
	"io/ioutil"
	"net/http"
)

const baseURL = "http://3.22.232.137:8001/"

// Do does what do does
func Do(method string, endpoint string, body []byte) error {
	url := baseURL + endpoint

	request, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	client := http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return err
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		return errors.New("Error received from eyecandy: " + string(responseMessage))
	}

	return nil
}
