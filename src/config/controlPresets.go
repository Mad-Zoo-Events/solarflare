package config

import "github.com/eynorey/candyshop/src/model"

func loadParticleEffectPresets() []model.ParticleEffectPreset {
	return []model.ParticleEffectPreset{
		model.ParticleEffectPreset{
			ID:          "4833c0c9-c721-4911-bd6a-0f5789b27229",
			DisplayName: "Drop",
			Description: "Explosions and flashes at point 0",
			ParticleEffects: []model.ParticleEffect{
				model.ParticleEffect{
					Name: "explosion_emitter", // TODO: make "enum"
					Region: model.Region{
						PointIDs:   []int{0},
						RegionType: model.PointsRegionType,
					},
				},
				model.ParticleEffect{
					Name: "flash", // TODO: make "enum"
					Region: model.Region{
						PointIDs:   []int{0},
						RegionType: model.PointsRegionType,
					},
				},
			},
		},
	}
}

func loadDragonEffectPresets() []model.DragonEffectPreset {
	return []model.DragonEffectPreset{
		model.DragonEffectPreset{
			ID:          "7b428799-29ef-4912-89b8-cd93c96490c7",
			DisplayName: "Dragon Center",
			Description: "Dragon in the center of the stage",
			DragonEffects: []model.DragonEffect{
				model.DragonEffect{
					PointID: 0,
					Static:  true,
				},
			},
		},
	}
}
