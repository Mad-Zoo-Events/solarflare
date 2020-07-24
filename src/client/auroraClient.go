package client

import (
	"bytes"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

var client *http.Client

func init() {
	tr := &http.Transport{
		MaxIdleConnsPerHost: 20,
	}
	client = &http.Client{
		Timeout:   time.Duration(5 * time.Second),
		Transport: tr,
	}
}

// ExecuteEffect executes an effect on all servers
func ExecuteEffect(endpoint string, body []byte) error {
	cfg := config.Get()

	errCount := 0

	var wg sync.WaitGroup

	for _, server := range cfg.Servers {
		url := server.Address + endpoint
		wg.Add(1)
		go executeEffect(url, &body, &wg, &errCount)
	}

	wg.Wait()

	if errCount > 0 {
		if errCount == len(cfg.Servers) {
			return sferror.New(sferror.FailedOnAuroraAll, "Command failed on all servers", nil)
		}
		return sferror.New(sferror.FailedOnAuroraSome, fmt.Sprintf("Command failed on %d out of %d servers", errCount, len(cfg.Servers)), nil)
	}

	return nil
}

func executeEffect(url string, body *[]byte, wg *sync.WaitGroup, errCount *int) {
	defer wg.Done()
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	request.Header.Add("Idempotency-Key", "oof.")
	request.Header.Add("Content-Type", "application/json")
	if err != nil {
		sferror.New(sferror.Encoding, "Error compiling request to Aurora", err)
		*errCount++
		return
	}

	response, err := client.Do(request)
	if err != nil {
		sferror.New(sferror.Aurora, "Error sending request to Aurora", err)
		*errCount++
		return
	}

	if response.StatusCode < 200 || response.StatusCode >= 400 {
		responseMessage, _ := ioutil.ReadAll(response.Body)
		sferror.New(sferror.Aurora, "Error "+strconv.Itoa(response.StatusCode)+" received from Aurora", errors.New(string(responseMessage)))
		*errCount++
		return
	}
}
