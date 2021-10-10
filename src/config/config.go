package config

import (
	"os"

	"github.com/eynorey/solarflare/src/model"
	"github.com/gin-gonic/gin"
)

func init() {
	cfg.Stages = []string{"mzitv", "stratos", "iod", "hotg", "rnr", "rnrwarmup"}
	cfg.SelectedStage = cfg.Stages[len(cfg.Stages)-1]

	cfg.AppVersion = appVersion

	if os.Getenv("ENVIRONMENT") == "dev" {
		cfg.RunningOnDev = true
	} else {
		gin.SetMode(gin.ReleaseMode)
	}
}

// set at build time
var appVersion = "dev"

// Config contains the server configuration
type Config struct {
	CommandEffectPresets   []model.CommandEffectPreset
	DragonEffectPresets    []model.DragonEffectPreset
	LaserEffectPresets     []model.LaserEffectPreset
	LightningEffectPresets []model.LightningEffectPreset
	ParticleEffectPresets  []model.ParticleEffectPreset
	PotionEffectPresets    []model.PotionEffectPreset
	TimeshiftEffectPresets []model.TimeshiftEffectPreset

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
