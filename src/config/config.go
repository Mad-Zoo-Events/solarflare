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
	Servers                []model.Server
}

var cfg Config

// Get returns the server config
func Get() *Config {
	return &cfg
}
