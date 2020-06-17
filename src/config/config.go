package config

import (
	"github.com/eynorey/candyshop/src/model"
)

// Config contains the server configuration
type Config struct {
	ParticleEffectPresets  []model.ParticleEffectPreset
	DragonEffectPresets    []model.DragonEffectPreset
	TimeshiftEffectPresets []model.TimeshiftEffectPreset
	Servers                []model.Server
}

var cfg Config

// Get returns the server config
func Get() *Config {
	return &cfg
}
