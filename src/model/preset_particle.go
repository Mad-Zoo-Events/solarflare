package model

import (
	"math"
	"strconv"
	"strings"
)

const (
	m = 5.0404e-05
	n = -4.0404e-05
)

// ************** //
// INTERNAL MODEL //
// ************** //

// ParticleEffectPreset is the domain model for particle effects
type ParticleEffectPreset struct {
	Preset

	ParticleEffects []ParticleEffect `json:"particleEffects"`
}

// ParticleEffect contains information on the effect and where to display it
type ParticleEffect struct {
	// Minecraft name of the particle effect
	Name string `json:"name"`
	// Region information on where and how to display the effect
	Region Region `json:"region"`
	// Region information on where and how to display the effect
	AdditionalOptions AdditionalOptions `json:"additionalOptions,omitempty"`
}

// Region contains information on where and how to display the particle effect
type Region struct {
	// List of predefined points in the Minecraft world
	PointIDs []int `json:"pointIDs"`
	// Type of the region the effect is to be displayed in
	RegionType string `json:"type"`
	// Whether or not to randomize placement of particles within the region [for Cuboid and Equation region type]
	Randomize *bool `json:"randomize,omitempty"`
	// Density of the particles [for Cuboid and Equation region type]
	Density *float64 `json:"density,omitempty"` // MIN 0.00001 | MAX 0.01
	// Equation for the shape of the effect region [for EquationRegionType]
	Equation *string `json:"equation,omitempty"`
}

// AdditionalOptions contains optional parameters for specific particle effects (such as redstone dust color)
type AdditionalOptions struct {
	// Only for REDSTONE
	DustColor *[]int   `json:"dustColor,omitempty"` // RGB color of redstone dust particles
	DustSize  *float64 `json:"dustSize,omitempty"`  // Size of redstone dust particles

	// Only for ITEM_CRACK, BLOCK_CRACK, BLOCK_DUST and FALLING_DUST
	MaterialName *string `json:"materialName,omitempty"` // Name of the Minecraft material (e.g. STONE)
}

// ********* //
// API MODEL //
// ********* //

// ParticleEffectPresetAPI is the inbound request and response model for particle effect presets
type ParticleEffectPresetAPI struct {
	Preset

	ParticleEffects []ParticleEffectAPI `json:"particleEffects"`
}

// ParticleEffectAPI is the inbound request and response model for particle effects
type ParticleEffectAPI struct {
	Name string `json:"name"`

	PointIDList string   `json:"pointIDList"` // Comma-separated list of point IDs
	RegionType  string   `json:"regionType"`
	Randomize   *bool    `json:"randomize,omitempty"`
	Density     *float64 `json:"density,omitempty"` // min 1 | max 100
	Equation    *string  `json:"equation,omitempty"`

	// Only for REDSTONE
	DustColor *string  `json:"dustColor,omitempty"` // comma-separated RGB color parts of redstone dust particles
	DustSize  *float64 `json:"dustSize,omitempty"`  // size of redstone dust particles
	// Only for ITEM_CRACK, BLOCK_CRACK, BLOCK_DUST and FALLING_DUST
	MaterialName *string `json:"materialName,omitempty"` // Name of the Minecraft material (e.g. STONE)
}

// ******************** //
// TO/FROM API REDUCERS //
// ******************** //

// ToAPI transforms the internal model to the API model
func (preset ParticleEffectPreset) ToAPI() ParticleEffectPresetAPI {
	effects := []ParticleEffectAPI{}
	for i := range preset.ParticleEffects {
		effect := preset.ParticleEffects[i]

		pointIDBuilder := strings.Builder{}
		for _, p := range effect.Region.PointIDs {
			pointIDBuilder.WriteString(strconv.Itoa(p))
			pointIDBuilder.WriteString(",")
		}

		apiEffect := ParticleEffectAPI{
			Name:        effect.Name,
			Equation:    effect.Region.Equation,
			PointIDList: strings.TrimSuffix(pointIDBuilder.String(), ","),
			Randomize:   effect.Region.Randomize,
			RegionType:  effect.Region.RegionType,
		}

		if effect.Region.Density != nil {
			density := densityToAPI(*effect.Region.Density)
			apiEffect.Density = &density
		}

		if effect.AdditionalOptions.DustColor != nil {
			dustColorBuilder := strings.Builder{}
			for _, p := range *effect.AdditionalOptions.DustColor {
				dustColorBuilder.WriteString(strconv.Itoa(p))
				dustColorBuilder.WriteString(",")
			}
			dustColor := strings.TrimSuffix(dustColorBuilder.String(), ",")
			apiEffect.DustColor = &dustColor
		}

		apiEffect.DustSize = effect.AdditionalOptions.DustSize
		apiEffect.MaterialName = effect.AdditionalOptions.MaterialName

		effects = append(effects, apiEffect)
	}
	return ParticleEffectPresetAPI{
		Preset:          preset.Preset,
		ParticleEffects: effects,
	}
}

// FromAPI transforms the API model to the internal model
func (preset ParticleEffectPresetAPI) FromAPI() ParticleEffectPreset {
	effects := []ParticleEffect{}
	for i := range preset.ParticleEffects {
		effect := preset.ParticleEffects[i]

		pointIDs := []int{}
		for _, p := range strings.Split(effect.PointIDList, ",") {
			if point, err := strconv.Atoi(p); err == nil {
				pointIDs = append(pointIDs, point)
			}
		}

		particleEffect := ParticleEffect{
			Name: effect.Name,
			Region: Region{
				PointIDs:   pointIDs,
				Equation:   effect.Equation,
				Randomize:  effect.Randomize,
				RegionType: effect.RegionType,
			},
		}

		if effect.Density != nil {
			density := densityFromAPI(*effect.Density)
			particleEffect.Region.Density = &density
		}

		particleEffect.AdditionalOptions = AdditionalOptions{
			DustSize:     effect.DustSize,
			MaterialName: effect.MaterialName,
		}

		if effect.DustColor != nil {
			rgb := []int{}
			for _, part := range strings.Split(*effect.DustColor, ",") {
				p, _ := strconv.Atoi(part)
				rgb = append(rgb, p)
			}
			particleEffect.AdditionalOptions.DustColor = &rgb
		}

		effects = append(effects, particleEffect)
	}
	return ParticleEffectPreset{
		Preset:          preset.Preset,
		ParticleEffects: effects,
	}
}

func densityFromAPI(density float64) float64 {
	return m*density + n
}

func densityToAPI(density float64) float64 {
	return math.Round(((density-n)/m)*10) / 10
}
