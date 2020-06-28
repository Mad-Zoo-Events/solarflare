package controller

import (
	"fmt"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// RunEffect runs an effect on Aurora
func RunEffect(id string, effectType model.EffectType, action model.EffectAction) error {
	if !action.IsAllowedOn(effectType) {
		return sferror.New(sferror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for on type %s", action, effectType), nil)
	}

	if action == model.StopEffectAction {
		return manager.StopEffect(id)
	}

	preset, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	switch effectType {
	case model.ParticleEffectType:
		return manager.RunParticleEffect(preset.(model.ParticleEffectPreset), action)
	case model.DragonEffectType:
		return manager.RunDragonEffect(preset.(model.DragonEffectPreset), action)
	case model.TimeshiftEffectType:
		return manager.RunTimeshiftEffect(preset.(model.TimeshiftEffectPreset), action)
	case model.PotionEffectType:
		return manager.RunPotionEffect(preset.(model.PotionEffectPreset), action)
	}

	return sferror.New(sferror.InvalidEffectType, string(effectType), nil)
}
