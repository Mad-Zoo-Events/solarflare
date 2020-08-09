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
		sendEffectUpdate(preset.ID, preset.DisplayName, action, err)
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
		sendEffectUpdate(preset.ID, preset.DisplayName, action, err)
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
		sendEffectUpdate(preset.ID, preset.DisplayName, action, err)
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
		sendEffectUpdate(preset.ID, preset.DisplayName, action, err)
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
	if preset.LaserEffects[0].EndPointID != nil {
		laserEndpoint = laserEffectEndpoint
	}

	endpoint := fmt.Sprintf("%s/%s/%s", laserEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	if sendUpdate {
		sendEffectUpdate(preset.ID, preset.DisplayName, action, err)
	}

	return err
}

// StopEffect stops an effect by ID
func StopEffect(id string, sendUpdate bool) error {
	endpoint := fmt.Sprintf("%s/%s/stop", effectsEndpoint, id)

	err := client.ExecuteEffect(endpoint, nil)

	if sendUpdate {
		sendEffectUpdate(id, "", model.StopEffectAction, err)
	}

	return err
}

// StopAll removes all clock subscriptions and stops all effects
func StopAll() error {
	UnsubscribeEffectFromClock("all", model.ParticleEffectType)

	endpoint := effectsEndpoint + "/all/stop"
	err := client.ExecuteEffect(endpoint, nil)

	sendEffectUpdate("all", "", model.StopEffectAction, nil)

	return err
}

func sendEffectUpdate(id, dispalyName string, action model.EffectAction, err error) {
	update := model.UIUpdate{
		EffectUpdate: &model.EffectUpdate{
			ID:          id,
			DisplayName: dispalyName,
			Action:      action,
		},
	}

	if err != nil {
		update.EffectUpdate.ErrorMessage = err.Error()
	}

	SendUIUpdate(update)
}
