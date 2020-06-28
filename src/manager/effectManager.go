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

	return client.ExecuteEffect(endpoint, body)
}

// RunDragonEffect compiles a dragon effect request and executes it on all servers
func RunDragonEffect(preset model.DragonEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", dragonEffectEndpoint, preset.ID, string(action))

	return client.ExecuteEffect(endpoint, body)
}

// RunTimeshiftEffect compiles a timeshift effect request and executes it on all servers
func RunTimeshiftEffect(preset model.TimeshiftEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.TimeshiftEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", timeshiftEffectEndpoint, preset.ID, string(action))

	return client.ExecuteEffect(endpoint, body)
}

// RunPotionEffect compiles a potion effect request and executes it on all servers
func RunPotionEffect(preset model.PotionEffectPreset, action model.EffectAction) error {
	body, err := json.Marshal(preset.PotionEffects)
	if err != nil {
		return sferror.New(sferror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s/%s", potionEffectEndpoint, preset.ID, string(action))

	return client.ExecuteEffect(endpoint, body)
}

// StopEffect stops an effect by ID
func StopEffect(id string) error {
	endpoint := fmt.Sprintf("%s/%s/stop", effectsEndpoint, id)
	return client.ExecuteEffect(endpoint, nil)
}
