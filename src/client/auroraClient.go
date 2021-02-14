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
		TLSHandshakeTimeout: time.Duration(2 * time.Second),
	}
	client = &http.Client{
		Timeout:   time.Duration(10 * time.Second),
		Transport: tr,
	}
}

// ExecuteEffect executes an effect on all servers
func ExecuteEffect(endpoint string, body []byte) error {
	cfg := config.Get()

	errCount := 0
	serverCount := 0

	var wg sync.WaitGroup

	for _, server := range cfg.Servers {
		if !server.IsActive {
			continue
		}

		url := server.PrivateAddress + endpoint
		if cfg.RunningOnDev {
			url = server.PublicAddress + endpoint
		}

		serverCount++

		wg.Add(1)
		go executeEffect(url, &body, &wg, &errCount)
	}

	wg.Wait()

	if errCount > 0 {
		if errCount == serverCount {
			return sferror.New(sferror.FailedOnAuroraAll, "Command failed on all servers", nil)
		}
		return sferror.New(sferror.FailedOnAuroraSome, fmt.Sprintf("Command failed on %d out of %d servers", errCount, serverCount), nil)
	}

	return nil
}

func executeEffect(url string, body *[]byte, wg *sync.WaitGroup, errCount *int) {
	defer wg.Done()
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	if err != nil {
		sferror.New(sferror.Encoding, "Error compiling request to Aurora", err)
		*errCount++
		return
	}
	request.Header.Add("Idempotency-Key", "oof.")
	request.Header.Add("Content-Type", "application/json")

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
