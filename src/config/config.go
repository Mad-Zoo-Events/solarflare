package config

import (
	"os"

	"github.com/eynorey/solarflare/src/model"
)

func init() {
	cfg.AppVersion = appVersion

	env := os.Getenv("ENVIRONMENT")
	if env == "dev" {
		cfg.RunningOnDev = true
	}
}

// set at build time
var appVersion = "local"

// Config contains the server configuration
type Config struct {
	ParticleEffectPresets  []model.ParticleEffectPreset
	DragonEffectPresets    []model.DragonEffectPreset
	TimeshiftEffectPresets []model.TimeshiftEffectPreset
	PotionEffectPresets    []model.PotionEffectPreset
	LaserEffectPresets     []model.LaserEffectPreset

	Servers []model.Server

	Stages        []string
	SelectedStage string

	RunningOnDev bool
	AppVersion   string
}

var cfg Config

// Get returns the server config
func Get() *Config {
	return &cfg
}
