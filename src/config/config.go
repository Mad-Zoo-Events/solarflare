package config

import (
	"github.com/eynorey/solarflare/src/model"
)

// Config contains the server configuration
type Config struct {
	ParticleEffectPresets  []model.ParticleEffectPreset
	DragonEffectPresets    []model.DragonEffectPreset
	TimeshiftEffectPresets []model.TimeshiftEffectPreset
	PotionEffectPresets    []model.PotionEffectPreset
	LaserEffectPresets     []model.LaserEffectPreset

	Servers []model.Server

	RunningOnDev bool
}

var cfg Config

// Get returns the server config
func Get() *Config {
	return &cfg
}
