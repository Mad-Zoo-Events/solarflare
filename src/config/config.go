package config

import "github.com/eynorey/candyshop/src/model"

// GetParticleEffects returns the list of particle effects available
func GetParticleEffects() []model.ParticleEffectControl {
	return []model.ParticleEffectControl{
		model.ParticleEffectControl{
			Name:        "angry_villager",
			DisplayName: "Fire Clouds",
		},

		model.ParticleEffectControl{
			Name:        "barrier",
			DisplayName: "Barrier",
		},

		model.ParticleEffectControl{
			Name:        "dragon_breath",
			DisplayName: "Magenta Blizzard",
		},

		model.ParticleEffectControl{
			Name:        "dripping_lava",
			DisplayName: "Fire Rain",
		},

		model.ParticleEffectControl{
			Name:        "explosion",
			DisplayName: "Explosion",
		},

		model.ParticleEffectControl{
			Name:        "flash",
			DisplayName: "Flashes",
		},

		model.ParticleEffectControl{
			Name:        "heart",
			DisplayName: "Hearts",
		},

		model.ParticleEffectControl{
			Name:        "rain",
			DisplayName: "Rain",
		},

		model.ParticleEffectControl{
			Name:        "sweep_attack",
			DisplayName: "Sweep",
		},
	}
}

// GetDragon returns information on the dragon effect
func GetDragon() model.DragonControl {
	return model.DragonControl{
		DisplayName: "Dragon",
	}
}
