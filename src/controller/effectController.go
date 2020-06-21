package controller

import (
	"fmt"

	"github.com/eynorey/solarflare/src/manager"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// RunEffect runs an effect on Aurora
func RunEffect(id string, effectType model.EffectType, action model.Action) error {
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
	case model.EffectTypeParticle:
		return manager.RunParticleEffect(preset.(model.ParticleEffectPreset), action)
	case model.EffectTypeDragon:
		return manager.RunDragonEffect(preset.(model.DragonEffectPreset), action)
	case model.EffectTypeTimeshift:
		return manager.RunTimeshiftEffect(preset.(model.TimeshiftEffectPreset), action)
	case model.EffectTypePotion:
		return manager.RunPotionEffect(preset.(model.PotionEffectPreset), action)
	}

	return sferror.New(sferror.InvalidEffectType, string(effectType), nil)
}
