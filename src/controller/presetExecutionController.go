package controller

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/eynorey/candyshop/src/utils/cserror"

	"github.com/eynorey/candyshop/src/client"

	"github.com/eynorey/candyshop/src/model"
)

const (
	endpointParticleEffect = "/effects/particle"
	endpointDragon         = "/effects/dragon"
)

// ExecuteParticleEffectPreset compiles a particle effect request and executes it on all servers
func ExecuteParticleEffectPreset(preset model.ParticleEffectPreset, action model.Action) error {
	if action != model.TriggerEffectAction &&
		action != model.StartEffectAction &&
		action != model.StopEffectAction {
		return cserror.New(cserror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for particle effects", action), nil)
	}

	log.Printf("Performing %s %s", action, preset.DisplayName)

	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", endpointParticleEffect, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

// ExecuteDragonEffectPreset compiles a dragon effect request and executes it on all servers
func ExecuteDragonEffectPreset(preset model.DragonEffectPreset, action model.Action) error {
	if action != model.StartEffectAction &&
		action != model.RestartEffectAction &&
		action != model.StopEffectAction {
		return cserror.New(cserror.ActionNotAllowed, fmt.Sprintf("Action %s is not allowed for the dragon effect", action), nil)
	}

	log.Printf("Performing %s %s", action, preset.DisplayName)

	body, err := json.Marshal(preset.DragonEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", endpointParticleEffect, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}
