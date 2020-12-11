package model

import (
	"math"
	"strconv"
	"strings"
)

// ************** //
// INTERNAL MODEL //
// ************** //

// ParticleEffectPreset describes a particle effect preset
type ParticleEffectPreset struct {
	ID              string           `json:"id" form:"id"`
	DisplayName     string           `json:"displayName" form:"displayName"`
	Description     string           `json:"description" form:"description"`
	KeyBinding      rune             `json:"keyBinding" form:"keyBinding"`
	ParticleEffects []ParticleEffect `json:"particleEffects" form:"effect"`

	// UI specific models
	UIKeyBinding             string         `json:"-" form:"-"`
	UIAllowedParticleEffects []string       `json:"-" form:"-"`
	UIAllowedRegionTypes     []UIRegionType `json:"-" form:"-"`
}

// ParticleEffect contains information on the effect and where to display it
type ParticleEffect struct {
	// Minecraft name of the particle effect
	Name string `json:"name" form:"name"`
	// Region information on where and how to display the effect
	Region Region `json:"region" form:"-"`
	// Region information on where and how to display the effect
	AdditionalOptions AdditionalOptions `json:"additionalOptions,omitempty" form:"-"`

	// UI specific models
	UIRegionPointIDs   string  `json:"-" form:"pointIds"`
	UIRegionRegionType string  `json:"-" form:"regionType"`
	UIRegionRandomize  bool    `json:"-" form:"randomize"`
	UIRegionDensity    float64 `json:"-" form:"density"`
	UIRegionEquation   string  `json:"-" form:"equation"`
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
	ID              string              `json:"id"`
	DisplayName     string              `json:"displayName"`
	Description     string              `json:"description"`
	KeyBinding      rune                `json:"keyBinding"`
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

// ****** //
// LEGACY //
// ****** //

// UIRegionType is used for displaying region type options on the UI
type UIRegionType struct {
	Name        string
	Description string
}

// RegionTypes is a list of all supported region types
var RegionTypes = []UIRegionType{
	{
		Name:        "POINTS",
		Description: "One particle at each specified point",
	},
	{
		Name:        "CUBOID",
		Description: "Inside a cuboid specified by two points",
	},
	{
		Name:        "EQUATION",
		Description: "In a shape described by an equation around one point",
	},
}

// MinecraftParticleEffects is a list of all supported Minecraft particle effects
var MinecraftParticleEffects = []string{
	"ASH",
	"BARRIER",
	"BLOCK_CRACK",
	"BLOCK_DUST",
	"BUBBLE_COLUMN_UP",
	"BUBBLE_POP",
	"CAMPFIRE_COSY_SMOKE",
	"CAMPFIRE_SIGNAL_SMOKE",
	"CLOUD",
	"COMPOSTER",
	"CRIMSON_SPORE",
	"CRIT_MAGIC",
	"CRIT",
	"CURRENT_DOWN",
	"DAMAGE_INDICATOR",
	"DOLPHIN",
	"DRAGON_BREATH",
	"DRIP_LAVA",
	"DRIP_WATER",
	"DRIPPING_HONEY",
	"DRIPPING_OBSIDIAN_TEAR",
	"ENCHANTMENT_TABLE",
	"END_ROD",
	"EXPLOSION_HUGE",
	"EXPLOSION_LARGE",
	"EXPLOSION_NORMAL",
	"FALLING_DUST",
	"FALLING_HONEY",
	"FALLING_LAVA",
	"FALLING_NECTAR",
	"FALLING_OBSIDIAN_TEAR",
	"FALLING_WATER",
	"FIREWORKS_SPARK",
	"FLAME",
	"FLASH",
	"HEART",
	"ITEM_CRACK(ItemStack.class)",
	"LANDING_HONEY",
	"LANDING_LAVA",
	"LANDING_OBSIDIAN_TEAR",
	"LAVA",
	"MOB_APPEARANCE",
	"NAUTILUS",
	"NOTE",
	"PORTAL",
	"REDSTONE(DustOptions.class)",
	"REVERSE_PORTAL",
	"SLIME",
	"SMOKE_LARGE",
	"SMOKE_NORMAL",
	"SNEEZE",
	"SNOW_SHOVEL",
	"SNOWBALL",
	"SOUL_FIRE_FLAME",
	"SOUL",
	"SPELL_INSTANT",
	"SPELL_MOB_AMBIENT",
	"SPELL_MOB",
	"SPELL_WITCH",
	"SPELL",
	"SPIT",
	"SQUID_INK",
	"SUSPENDED_DEPTH",
	"SUSPENDED",
	"SWEEP_ATTACK",
	"TOTEM",
	"TOWN_AURA",
	"VILLAGER_ANGRY",
	"VILLAGER_HAPPY",
	"WARPED_SPORE",
	"WATER_BUBBLE",
	"WATER_DROP",
	"WATER_SPLASH",
	"WATER_WAKE",
	"WHITE_AS",
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
			density := math.Round(convertDensity(*effect.Region.Density, false)*10) / 10
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
		ID:              preset.ID,
		DisplayName:     preset.DisplayName,
		Description:     preset.Description,
		KeyBinding:      preset.KeyBinding,
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
			density := convertDensity(*effect.Density, true)
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
		ID:              preset.ID,
		DisplayName:     preset.DisplayName,
		Description:     preset.Description,
		KeyBinding:      preset.KeyBinding,
		ParticleEffects: effects,
	}
}

func convertDensity(density float64, fromUI bool) float64 {
	m := 5.0404e-05
	n := -4.0404e-05

	if fromUI {
		return m*density + n
	}

	return (density - n) / m
}
