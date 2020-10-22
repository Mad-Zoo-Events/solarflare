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
		// I can do better than this
		sendEffectUpdate("bossbar", model.BossbarEffectType, bossbarRequest.Title+"௵"+string(bossbarRequest.Color), "SET", err)
	}

	return err
}

// ClearBossbar compiles a bossbar clear request and executes it on all servers
func ClearBossbar(sendUpdate bool) error {
	err := client.ExecuteEffect(clearBossbarEndpoint, []byte("erase yourself."))

	if sendUpdate {
		sendEffectUpdate("bossbar", model.BossbarEffectType, "", "CLEAR", err)
	}

	return err
}
