package utils

import (
	"fmt"

	"github.com/eynorey/candyshop/src/config"
	"github.com/eynorey/candyshop/src/model"
	"github.com/eynorey/candyshop/src/utils/cserror"
)

// FindPreset returns the preset identified by the ID passed, or an error if it couldn't be found
func FindPreset(id string, effectType model.EffectType) (interface{}, error) {
	cfg := config.Get()

	switch effectType {
	case model.EffectTypeParticleEffect:
		for _, p := range cfg.ParticleEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.EffectTypeDragon:
		for _, p := range cfg.DragonEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	}

	return nil, cserror.New(cserror.PresetNotFound, fmt.Sprintf("Preset with ID %s not found", id), nil)
}
