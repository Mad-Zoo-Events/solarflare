package config

import "github.com/eynorey/candyshop/src/model"

// Config contains the server configuration
type Config struct {
	ParticleEffects []model.ParticleEffectControl
	Dragon          model.DragonControl
	Servers         []model.Server
}

var cfg Config

func init() {
	cfg = Config{
		ParticleEffects: loadParticleEffectControls(),
		Dragon:          loadDragonControl(),
		Servers:         loadServers(),
	}
}

// Get returns the server config
func Get() Config {
	return cfg
}
