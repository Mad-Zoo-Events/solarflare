package config

import (
	"os"
	"sort"

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

// SetParticleEffectPresets sorts and sets the effect presets passed
func (c *Config) SetParticleEffectPresets(presets []model.ParticleEffectPreset) {
	sort.Slice(presets, func(i, j int) bool {
		return presets[i].DisplayName < presets[j].DisplayName
	})
	c.ParticleEffectPresets = presets
}

// SetDragonEffectPresets sorts and sets the effect presets passed
func (c *Config) SetDragonEffectPresets(presets []model.DragonEffectPreset) {
	sort.Slice(presets, func(i, j int) bool {
		return presets[i].DisplayName < presets[j].DisplayName
	})
	c.DragonEffectPresets = presets
}

// SetTimeshiftEffectPresets sorts and sets the effect presets passed
func (c *Config) SetTimeshiftEffectPresets(presets []model.TimeshiftEffectPreset) {
	sort.Slice(presets, func(i, j int) bool {
		return presets[i].DisplayName < presets[j].DisplayName
	})
	c.TimeshiftEffectPresets = presets
}

// SetPotionEffectPresets sorts and sets the effect presets passed
func (c *Config) SetPotionEffectPresets(presets []model.PotionEffectPreset) {
	sort.Slice(presets, func(i, j int) bool {
		return presets[i].DisplayName < presets[j].DisplayName
	})
	c.PotionEffectPresets = presets
}

// SetLaserEffectPresets sorts and sets the effect presets passed
func (c *Config) SetLaserEffectPresets(presets []model.LaserEffectPreset) {
	sort.Slice(presets, func(i, j int) bool {
		return presets[i].DisplayName < presets[j].DisplayName
	})
	c.LaserEffectPresets = presets
}
