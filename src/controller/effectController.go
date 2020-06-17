package controller

import (
	"fmt"

	"github.com/eynorey/candyshop/src/manager"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// RunEffect runs a eyecandy effect
func RunEffect(id string, effectType model.EffectType, action model.Action) error {
	if !action.IsAllowedOn(effectType) {
		return cserror.New(cserror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for on type %s", action, effectType), nil)
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
	}

	return cserror.New(cserror.Internal, "Invalid effect type: "+string(effectType), nil)
}
