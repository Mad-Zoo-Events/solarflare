package client

import (
	"bytes"
	"net/http"
)

const baseURL = "http://localhost:5000/"

// Do does what do does
func Do(method string, endpoint string, body []byte) error {
	url := baseURL + endpoint

	request, err := http.NewRequest(method, url, bytes.NewBuffer(body))
	if err != nil {
		return err
	}

	client := http.Client{}
	_, err = client.Do(request)
	if err != nil {
		return err
	}

	return nil
}
