package client

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/eynorey/candyshop/src/config"
)

// ExecuteEffect executes an effect on all servers
func ExecuteEffect(endpoint string, body []byte) error {
	cfg := config.Get()
	client := &http.Client{Timeout: time.Duration(1 * time.Second)}
	errCount := 0

	log.Println(string(body))

	var wg sync.WaitGroup

	for _, server := range cfg.Servers {
		url := server.Address + endpoint
		wg.Add(1)
		go executeEffect(client, url, &body, &wg, &errCount)
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

func executeEffect(client *http.Client, url string, body *[]byte, wg *sync.WaitGroup, errCount *int) {
	defer wg.Done()
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	if err != nil {
		log.Printf("Error compiling request to Eyecandy: %s", err.Error())
		*errCount++
		return
	}

	response, err := client.Do(request)
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
