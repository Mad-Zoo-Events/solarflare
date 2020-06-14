package controller

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/eynorey/candyshop/src/utils/cserror"

	"github.com/eynorey/candyshop/src/client"
	"github.com/eynorey/candyshop/src/config"

	"github.com/eynorey/candyshop/src/model"
)

const (
	endpointParticleEffect = "/effects/particle"
	endpointDragon         = "/effects/dragon"
)

// ExecuteParticleEffect compiles a particle effect request and executes it on all servers
func ExecuteParticleEffect(ID string, action model.Action) error {
	preset := getParticleEffectPreset(ID)
	if preset == nil {
		return cserror.New(cserror.PresetNotFound, fmt.Sprintf("Preset with ID %s not found", ID), nil)
	}

	log.Printf("Performing %s %s", action, preset.DisplayName)

	body, err := json.Marshal(preset.ParticleEffects)
	if err != nil {
		return cserror.New(cserror.Encoding, "Failed to marshal request", err)
	}

	endpoint := fmt.Sprintf("%s/%s?id=%s", endpointParticleEffect, string(action), preset.ID)

	return client.ExecuteEffect(endpoint, body)
}

func getParticleEffectPreset(ID string) *model.ParticleEffectPreset {
	cfg := config.Get()
	for _, p := range cfg.ParticleEffectPresets {
		if p.ID == ID {
			return &p
		}
	}
	return nil
}
