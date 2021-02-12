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
		return manager.StopEffect(id, true)
	}

	preset, err := utils.FindPreset(id, effectType)
	if err != nil {
		return err
	}

	switch effectType {
	case model.ParticleEffectType:
		return manager.RunParticleEffect(preset.(model.ParticleEffectPreset), action, true)
	case model.DragonEffectType:
		return manager.RunDragonEffect(preset.(model.DragonEffectPreset), action, true)
	case model.TimeshiftEffectType:
		return manager.RunTimeshiftEffect(preset.(model.TimeshiftEffectPreset), action, true)
	case model.PotionEffectType:
		return manager.RunPotionEffect(preset.(model.PotionEffectPreset), action, true)
	case model.LaserEffectType:
		return manager.RunLaserEffect(preset.(model.LaserEffectPreset), action, true)
	case model.CommandEffectType:
		return manager.RunCommandEffect(preset.(model.CommandEffectPreset), true)
	case model.LightningEffectType:
		return manager.RunLightningEffect(preset.(model.LightningEffectPreset), action, true)
	}

	return sferror.New(sferror.InvalidEffectType, string(effectType), nil)
}
