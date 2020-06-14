package config

import (
	"os"

	"github.com/eynorey/candyshop/src/model"
)

const envEncryptionKey = "ENCRYPTION_KEY"

// Config contains the server configuration
type Config struct {
	ParticleEffectPresets []model.ParticleEffectPreset
	DragonEffectPresets   []model.DragonEffectPreset
	Servers               []model.Server
	EncryptionKey         string
}

var cfg Config

func init() {
	encryptionKey := os.Getenv(envEncryptionKey)
	cfg = Config{
		ParticleEffectPresets: loadParticleEffectPresets(),
		DragonEffectPresets:   loadDragonEffectPresets(),
		Servers:               loadServers(),
		EncryptionKey:         encryptionKey,
	}
}

// Get returns the server config
func Get() Config {
	return cfg
}
