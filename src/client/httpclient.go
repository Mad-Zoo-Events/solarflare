package client

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/utils"
)

// SendEffectRequest send a effect request to all registeres eyecandy instances
func SendEffectRequest(endpoint string, request interface{}) error {
	cfg := config.Get()
	c := http.Client{
		Timeout: time.Duration(1 * time.Second),
	}

	body, err := json.Marshal(request)
	if err != nil {
		return utils.HandleError("Failed to marshal request", err)
	}

	var wg sync.WaitGroup
	errCount := 0

	for _, server := range cfg.Servers {
		url := server.Address + endpoint
		wg.Add(1)
		go sendEffectRequest(c, url, &body, &wg, &errCount)
	}

	wg.Wait()

	if errCount > 0 {
		if errCount == len(cfg.Servers) {
			return errors.New("Command failed on all servers")
		}
		return fmt.Errorf("Command failed on %d out of %d servers", errCount, len(cfg.Servers))
	}

	return nil
}

func sendEffectRequest(c http.Client, url string, body *[]byte, wg *sync.WaitGroup, errCount *int) {
	defer wg.Done()
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	if err != nil {
		log.Printf("Error compiling request to Eyecandy: %s", err.Error())
		*errCount++
		return
	}

	response, err := c.Do(request)
	if err != nil {
		log.Printf("Error sending request to Eyecandy: %s", err.Error())
		*errCount++
		return
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		log.Printf("Error received from Eyecandy: %s", string(responseMessage))
		*errCount++
		return
	}
}
