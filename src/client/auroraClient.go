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

const (
	defaultTimeout = time.Duration(5 * time.Second)
	longerTimeout  = time.Duration(20 * time.Second)
)

var client *http.Client

func init() {
	tr := &http.Transport{
		MaxIdleConnsPerHost: 20,
		TLSHandshakeTimeout: time.Duration(2 * time.Second),
	}
	client = &http.Client{
		Transport: tr,
	}
}

// ExecuteEffect executes an effect on all servers
func ExecuteEffect(endpoint string, body []byte, increaseTimeout bool) error {
	cfg := config.Get()

	timeout := defaultTimeout
	if increaseTimeout {
		timeout = longerTimeout
	}

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
		go executeEffect(url, &body, &wg, &errCount, timeout)
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

func executeEffect(url string, body *[]byte, wg *sync.WaitGroup, errCount *int, timeout time.Duration) {
	defer wg.Done()
	// sferror.New(sferror.Encoding, string(*body), nil) // Uncomment to see what is actually getting sent to aurora for debugging
	request, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(*body))
	if err != nil {
		sferror.New(sferror.Encoding, "Error compiling request to Aurora", err)
		*errCount++
		return
	}
	request.Header.Add("Idempotency-Key", "oof.")
	request.Header.Add("Content-Type", "application/json")

	client.Timeout = timeout
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
