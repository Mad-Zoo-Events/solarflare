package manager

import (
	"encoding/json"
	"fmt"

	"github.com/eynorey/solarflare/src/client"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

const (
	particleEffectEndpoint  = "/effects/particle"
	dragonEffectEndpoint    = "/effects/dragon"
	timeshiftEffectEndpoint = "/effects/time"
	potionEffectEndpoint    = "/effects/potion"
	effectsEndpoint         = "/effects"
)

// RunParticleEffect compiles a particle effect request and executes it on all servers
func RunParticleEffect(preset model.ParticleEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", particleEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	sendUpdate(preset.ID, preset.DisplayName, action, err)

	return err
}

// RunDragonEffect compiles a dragon effect request and executes it on all servers
func RunDragonEffect(preset model.DragonEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", dragonEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	sendUpdate(preset.ID, preset.DisplayName, action, err)

	return err
}

// RunTimeshiftEffect compiles a timeshift effect request and executes it on all servers
func RunTimeshiftEffect(preset model.TimeshiftEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.TimeshiftEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", timeshiftEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	sendUpdate(preset.ID, preset.DisplayName, action, err)

	return err
}

// RunPotionEffect compiles a potion effect request and executes it on all servers
func RunPotionEffect(preset model.PotionEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.PotionEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", potionEffectEndpoint, preset.ID, string(action))

	err = client.ExecuteEffect(endpoint, body)

	sendUpdate(preset.ID, preset.DisplayName, action, err)

	return err
}

// StopEffect stops an effect by ID
func StopEffect(id string) error {
	endpoint := fmt.Sprintf("%s/%s/stop", effectsEndpoint, id)

	err := client.ExecuteEffect(endpoint, nil)

	sendUpdate(id, "all effects", model.StopEffectAction, err)

	return err
}

func sendUpdate(id, dispalyName string, action model.EffectAction, err error) {
	update := model.UIUpdate{
		UpdateType: model.EffectUpdateType,
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
