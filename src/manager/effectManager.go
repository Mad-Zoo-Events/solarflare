package manager

import (
	"encoding/json"
	"fmt"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

const (
	particleEffectEndpoint  = "/effects/particle"
	dragonEffectEndpoint    = "/effects/dragon"
	timeshiftEffectEndpoint = "/effects/time"
	potionEffectEndpoint    = "/effects/potion"
	stopEndpoint            = "/effects/stop"
)

// RunParticleEffect compiles a particle effect request and executes it on all servers
func RunParticleEffect(preset model.ParticleEffectPreset, action model.Action) error {
	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", particleEffectEndpoint, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

// RunDragonEffect compiles a dragon effect request and executes it on all servers
func RunDragonEffect(preset model.DragonEffectPreset, action model.Action) error {
	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", dragonEffectEndpoint, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

// RunTimeshiftEffect compiles a timeshift effect request and executes it on all servers
func RunTimeshiftEffect(preset model.TimeshiftEffectPreset, action model.Action) error {
	body, err := json.Marshal(preset.TimeshiftEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", timeshiftEffectEndpoint, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

// RunPotionEffect compiles a potion effect request and executes it on all servers
func RunPotionEffect(preset model.PotionEffectPreset, action model.Action) error {
	body, err := json.Marshal(preset.PotionEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", potionEffectEndpoint, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

// StopEffect stops an effect by ID
func StopEffect(id string) error {
	endpoint := fmt.Sprintf("%s?id=%s", stopEndpoint, id)
	return client.ExecuteEffect(endpoint, nil)
}
