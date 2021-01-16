package controller

import (
	"encoding/json"
	"fmt"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// SetBossbar controls the bossbar
func SetBossbar(action model.EffectAction, body []byte) error {
	if !action.IsAllowedOn(model.BossbarEffectType) {
		return sferror.New(sferror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for the boss bar", action), nil)
	}

	if action == model.ClearBossbarAction {
		return manager.ClearBossbar(true)
	}

	request := model.BossbarRequest{}
	if err := json.Unmarshal(body, &request); err != nil {
		return sferror.New(sferror.Encoding, "Error unmarshalling bossbar request", err)
	}

	return manager.SetBossbar(request, true)
}
