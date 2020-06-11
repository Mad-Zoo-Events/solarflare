package config

import (
	"os"

	"github.com/eynorey/candyshop/src/model"
)

const envEncryptionKey = "ENCRYPTION_KEY"

// Config contains the server configuration
type Config struct {
	ParticleEffects []model.ParticleEffectControl
	Dragon          model.DragonControl
	Servers         []model.Server
	EncryptionKey   string
}

var cfg Config

func init() {
	encryptionKey := os.Getenv(envEncryptionKey)
	cfg = Config{
		ParticleEffects: loadParticleEffectControls(),
		Dragon:          loadDragonControl(),
		Servers:         loadServers(),
		EncryptionKey:   encryptionKey,
	}
}

// Get returns the server config
func Get() Config {
	return cfg
}
