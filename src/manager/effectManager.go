package manager

import (
	"encoding/json"
	"fmt"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	commandsEndpoint             = "/commands"
	effectsAllEndpoint           = "/effects/all"
	effectsStopEndpoint          = "/effects/stop"
	effectsDragonEndpoint        = "/effects/dragon"
	effectsLaserEndEndpoint      = "/effects/endlaser"
	effectsLaserEndpoint         = "/effects/laser"
	effectsLaserTargetedEndpoint = "/effects/targetedlaser"
	effectsLightningEndpoint     = "/effects/lightning"
	effectsParticleEndpoint      = "/effects/particle"
	effectsPotionEndpoint        = "/effects/potion"
	effectsTimeEndpoint          = "/effects/time"
)

// RunCommandEffect compiles a command effect request and executes it on all servers
func RunCommandEffect(preset model.CommandEffectPreset, sendUpdate bool) error {
	body, err := json.Marshal(preset.Commands)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	err = client.ExecuteEffect(commandsEndpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.CommandEffectType, preset.DisplayName, model.TriggerEffectAction, err)
	}

	return err
}

// RunDragonEffect compiles a dragon effect request and executes it on all servers
func RunDragonEffect(preset model.DragonEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", effectsDragonEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.DragonEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunLaserEffect compiles a laser effect request and executes it on all servers
func RunLaserEffect(preset model.LaserEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.LaserEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	laserEndpoint := ""
	switch preset.LaserType {
	case model.EndLaserType:
		laserEndpoint = effectsLaserEndEndpoint
	case model.NonTargetingGuardianLaserType:
		laserEndpoint = effectsLaserEndpoint
	case model.TargetingGuardianLaserType:
		laserEndpoint = effectsLaserTargetedEndpoint
	}

	endpoint := fmt.Sprintf("%s/%s/%s", laserEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.LaserEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunLightningEffect compiles a lightning effect request and executes it on all servers
func RunLightningEffect(preset model.LightningEffectPreset, action model.EffectAction, sendUpdate bool) error {
	type effect struct {
		PointIDs []int `json:"pointIds"`
	}

	request := []effect{{PointIDs: preset.PointIDs}}
	body, err := json.Marshal(request)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", effectsLightningEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.LightningEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunParticleEffect compiles a particle effect request and executes it on all servers
func RunParticleEffect(preset model.ParticleEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", effectsParticleEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.ParticleEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunPotionEffect compiles a potion effect request and executes it on all servers
func RunPotionEffect(preset model.PotionEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.PotionEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", effectsPotionEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.PotionEffectType, preset.DisplayName, action, err)
	}

	return err
}

// RunTimeshiftEffect compiles a timeshift effect request and executes it on all servers
func RunTimeshiftEffect(preset model.TimeshiftEffectPreset, action model.EffectAction, sendUpdate bool) error {
	body, err := json.Marshal(preset.TimeshiftEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", effectsTimeEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, model.TimeshiftEffectType, preset.DisplayName, action, err)
	}

	return err
}

// StopEffect stops an effect by ID
func StopEffect(id string, sendUpdate bool) error {
	endpoint := fmt.Sprintf("%s/%s/stop", effectsStopEndpoint, id)

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
		errMsg := err.Error()
		update.EffectUpdate.ErrorMessage = &errMsg
	}

	SendUIUpdate(update)

	return err
}

func runStopAll(effectType *model.EffectType) error {
	if effectType == nil {
		return client.ExecuteEffect(effectsAllEndpoint+"/stop", nil)
	}

	switch *effectType {
	case model.DragonEffectType:
		return client.ExecuteEffect(effectsDragonEndpoint+"/stop", nil)
	case model.LaserEffectType:
		err := client.ExecuteEffect(effectsLaserEndpoint+"/stop", nil)
		err = client.ExecuteEffect(effectsLaserEndEndpoint+"/stop", nil)
		err = client.ExecuteEffect(effectsLaserTargetedEndpoint+"/stop", nil)

		if err != nil {
			return err
		}
	case model.LightningEffectType:
		return client.ExecuteEffect(effectsLightningEndpoint+"/stop", nil)
	case model.ParticleEffectType:
		return client.ExecuteEffect(effectsParticleEndpoint+"/stop", nil)
	case model.PotionEffectType:
		return client.ExecuteEffect(effectsPotionEndpoint+"/stop", nil)
	case model.TimeshiftEffectType:
		return client.ExecuteEffect(effectsTimeEndpoint+"/stop", nil)
	}

	return nil
}

func sendEffectUpdate(id string, effectType model.EffectType, dispalyName string, action model.EffectAction, err error) {
	update := model.UIUpdate{
		EffectUpdate: &model.EffectUpdate{
			ID:          &id,
			EffectType:  &effectType,
			DisplayName: &dispalyName,
			Action:      &action,
		},
	}

	if err != nil {
		errMsg := err.Error()
		update.EffectUpdate.ErrorMessage = &errMsg
	}

	SendUIUpdate(update)
}
