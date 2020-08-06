package controller

import (
	"fmt"
	"net/url"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// SetBossbar controls the bossbar
func SetBossbar(action model.EffectAction, values url.Values) error {
	if !action.IsAllowedOn(model.BossbarEffectType) {
		return sferror.New(sferror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for the bossbar", action), nil)
	}

	if action == model.ClearBossbarAction {
		return manager.ClearBossbar(true)
	}

	bossbarRequest := model.BossbarRequest{}
	err := decoder.Decode(&bossbarRequest, values)
	if err != nil {
		return sferror.New(sferror.Encoding, "Error parsing data from the bossbar request", err)
	}

	return manager.SetBossbar(bossbarRequest, true)
}
