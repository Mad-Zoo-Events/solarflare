package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/utils"
)

var (
	errCount int
	respErr  error
)

// SendEffectRequest send a effect request to all registeres eyecandy instances
func SendEffectRequest(endpoint string, request interface{}) error {
	body, err := json.Marshal(request)
	if err != nil {
		return utils.HandleError("Failed to marshal request", err)
	}

	cfg := config.Get()
	c := http.Client{
		Timeout: time.Duration(5 * time.Second),
	}

	var wg sync.WaitGroup
	errCount = 0
	respErr = nil
	for _, server := range cfg.Servers {
		url := server.Address + endpoint
		wg.Add(1)
		go sendEffectRequest(c, url, &body, &wg)
	}

	wg.Wait()

	if respErr != nil {
		if errCount == len(cfg.Servers) {
			return utils.HandleError("Command failed on all servers", respErr)
		}
		return utils.HandleError(fmt.Sprintf("Command failed on %d out of %d servers", errCount, len(cfg.Servers)), respErr)
	}

	return nil
}

func sendEffectRequest(c http.Client, url string, body *[]byte, wg *sync.WaitGroup) {
	defer wg.Done()
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	if err != nil {
		respErr = fmt.Errorf("Error compiling request to Eyecandy: %s", err.Error())
		errCount++
		return
	}

	response, err := c.Do(request)
	if err != nil {
		respErr = fmt.Errorf("Error sending request to Eyecandy: %s", err.Error())
		errCount++
		return
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		respErr = fmt.Errorf("Error received from Eyecandy: %s", string(responseMessage))
		errCount++
		return
	}
}
