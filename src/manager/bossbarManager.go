package manager

import (
	"encoding/json"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	setBossbarEndpoint   = "/bar/set"
	clearBossbarEndpoint = "/bar/clear"
)

// SetBossbar compiles a bossbar update request and executes it on all servers
func SetBossbar(bossbarRequest model.BossbarRequest, sendUpdate bool) error {
	body, err := json.Marshal([]model.BossbarRequest{bossbarRequest})
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	err = client.ExecuteEffect(setBossbarEndpoint, body)

	if sendUpdate {
		SendUIUpdate(model.UIUpdate{
			BossbarUpdate: &model.BossbarUpdate{
				Text:   bossbarRequest.Title,
				Color:  string(bossbarRequest.Color),
				Action: model.SetBossbarAction,
			},
		})
	}

	return err
}

// ClearBossbar compiles a bossbar clear request and executes it on all servers
func ClearBossbar(sendUpdate bool) error {
	err := client.ExecuteEffect(clearBossbarEndpoint, []byte("erase yourself."))

	if sendUpdate {
		SendUIUpdate(model.UIUpdate{
			BossbarUpdate: &model.BossbarUpdate{
				Action: model.ClearBossbarAction,
			},
		})
	}

	return err
}
