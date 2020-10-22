package manager

import (
	"encoding/json"
	"fmt"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	particleEffectEndpoint      = "/effects/particle"
	dragonEffectEndpoint        = "/effects/dragon"
	timeshiftEffectEndpoint     = "/effects/time"
	potionEffectEndpoint        = "/effects/potion"
	targetedlaserEffectEndpoint = "/effects/targetedlaser"
	laserEffectEndpoint         = "/effects/laser"
	endlaserEffectEndpoint      = "/effects/endlaser"
	commandEffectEndpoint       = "/commands"
	effectsEndpoint             = "/effects"
)

// RunParticleEffect compiles a particle effect request and executes it on all servers
func RunParticleEffect(preset model.ParticleEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", particleEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.ParticleEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunDragonEffect compiles a dragon effect request and executes it on all servers
func RunDragonEffect(preset model.DragonEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", dragonEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.DragonEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunTimeshiftEffect compiles a timeshift effect request and executes it on all servers
func RunTimeshiftEffect(preset model.TimeshiftEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.TimeshiftEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", timeshiftEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.TimeshiftEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunPotionEffect compiles a potion effect request and executes it on all servers
func RunPotionEffect(preset model.PotionEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.PotionEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", potionEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.PotionEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunLaserEffect compiles a laser effect request and executes it on all servers
func RunLaserEffect(preset model.LaserEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.LaserEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	laserEndpoint := targetedlaserEffectEndpoint
	if preset.IsEndLaser {
		laserEndpoint = endlaserEffectEndpoint
	} else {
		if preset.IsNonPlayerTargeting {
			laserEndpoint = laserEffectEndpoint
		} else {
			laserEndpoint = targetedlaserEffectEndpoint
		}
	}

	endpoint := fmt.Sprintf("%s/%s/%s", laserEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.LaserEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunCommandEffect compiles a command effect request and executes it on all servers
func RunCommandEffect(preset model.CommandEffectPreset, sendUpdate bool) error {
	body, err := json.Marshal(preset.Commands)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	err = client.ExecuteEffect(commandEffectEndpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.CommandEffectType, preset.DisplayName, model.TriggerEffectAction, err)
	}

	return err
}

// StopEffect stops an effect by ID
func StopEffect(id string, sendUpdate bool) error {
	endpoint := fmt.Sprintf("%s/%s/stop", effectsEndpoint, id)

	err := client.ExecuteEffect(endpoint, nil)

	if sendUpdate {
		sendEffectUpdate(id, "", "", model.StopEffectAction, err)
	}

	return err
}

// StopAll removes all clock subscriptions and stops all effects
func StopAll(request *model.StopAllRequest) (err error) {
	if request.DetachClocks {
		UnsubscribeAllFromClock(request.SpecificTypeOnly)
	}

	if request.StopEffects {
		err = runStopAll(request.SpecificTypeOnly)
	}

	update := model.UIUpdate{
		EffectUpdate: &model.EffectUpdate{
			StopAll: request,
		},
	}

	if err != nil {
		update.EffectUpdate.ErrorMessage = err.Error()
	}

	SendUIUpdate(update)

	return err
}

func runStopAll(effectType *model.EffectType) error {
	if effectType == nil {
		return client.ExecuteEffect(effectsEndpoint+"/all/stop", nil)
	}

	switch *effectType {
	case model.ParticleEffectType:
		return client.ExecuteEffect(effectsEndpoint+"/particle/stop", nil)
	case model.DragonEffectType:
		return client.ExecuteEffect(effectsEndpoint+"/dragon/stop", nil)
	case model.TimeshiftEffectType:
		return client.ExecuteEffect(effectsEndpoint+"/time/stop", nil)
	case model.PotionEffectType:
		return client.ExecuteEffect(effectsEndpoint+"/potion/stop", nil)
	case model.LaserEffectType:
		err := client.ExecuteEffect(effectsEndpoint+"/laser/stop", nil)
		err = client.ExecuteEffect(effectsEndpoint+"/endlaser/stop", nil)
		err = client.ExecuteEffect(effectsEndpoint+"/targetedlaser/stop", nil)

		if err != nil {
			return err
		}
	}

	return nil
}

func sendEffectUpdate(id string, effectType model.EffectType, dispalyName string, action model.EffectAction, err error) {
	update := model.UIUpdate{
		EffectUpdate: &model.EffectUpdate{
			ID:          id,
			EffectType:  effectType,
			DisplayName: dispalyName,
			Action:      action,
		},
	}

	if err != nil {
		update.EffectUpdate.ErrorMessage = err.Error()
	}

	SendUIUpdate(update)
}
