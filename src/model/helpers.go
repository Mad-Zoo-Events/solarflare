package model

import (
	"strconv"
	"strings"
)

// TramsformFromUI transforms UI specific values to the main model
func (preset *ParticleEffectPreset) TramsformFromUI() {
	for i := range preset.ParticleEffects {
		effect := &preset.ParticleEffects[i]

		pointIDs := []int{}
		for _, p := range strings.Split(effect.UIRegionPointIDs, ",") {
			point, err := strconv.Atoi(p)
			if err == nil {
				pointIDs = append(pointIDs, point)
			}
		}

		effect.Region = Region{
			Density:    float64(effect.UIRegionDensity) / 100,
			Equation:   effect.UIRegionEquation,
			PointIDs:   pointIDs,
			Randomize:  effect.UIRegionRandomize,
			RegionType: effect.UIRegionRegionType,
		}
	}
}

// TransformToUI transforms sets UI specific values from the main model
func (preset *ParticleEffectPreset) TransformToUI() {
	for i := range preset.ParticleEffects {
		effect := &preset.ParticleEffects[i]
		region := effect.Region

		pointIDs := ""
		for _, p := range region.PointIDs {
			pointIDs = pointIDs + strconv.Itoa(p) + ","
		}
		pointIDs = strings.TrimSuffix(pointIDs, ",")

		effect.UIRegionDensity = int(region.Density * 100)
		effect.UIRegionEquation = region.Equation
		effect.UIRegionPointIDs = pointIDs
		effect.UIRegionRandomize = region.Randomize
		effect.UIRegionRegionType = region.RegionType

		preset.UIAllowedParticleEffects = MinecraftParticleEffects
		preset.UIAllowedRegionTypes = RegionTypes
	}
}
