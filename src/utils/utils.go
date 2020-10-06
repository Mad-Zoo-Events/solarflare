package utils

import (
	"fmt"

	"github.com/eynorey/solarflare/src/config"
	"github.com/eynorey/solarflare/src/model"
	"github.com/eynorey/solarflare/src/utils/sferror"
)

// FindPreset returns the preset identified by the ID passed, or an error if it couldn't be found
func FindPreset(id string, effectType model.EffectType) (interface{}, error) {
	cfg := config.Get()

	switch effectType {
	case model.ParticleEffectType:
		for _, p := range cfg.ParticleEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.DragonEffectType:
		for _, p := range cfg.DragonEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.TimeshiftEffectType:
		for _, p := range cfg.TimeshiftEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.PotionEffectType:
		for _, p := range cfg.PotionEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.LaserEffectType:
		for _, p := range cfg.LaserEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	case model.CommandEffectType:
		for _, p := range cfg.CommandEffectPresets {
			if p.ID == id {
				return p, nil
			}
		}
	default:
		return nil, sferror.New(sferror.InvalidEffectType, string(effectType), nil)
	}

	return nil, sferror.New(sferror.PresetNotFound, fmt.Sprintf("Preset with ID %s not found", id), nil)
}
