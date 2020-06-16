package model

// ParticleEffectPreset describes a particle effect preset
type ParticleEffectPreset struct {
	// Unique identifier of the preset
	ID string `json:"id" form:"id"`
	// Display name for the UI
	DisplayName string `json:"displayName" form:"displayName"`
	// Description of the preset for the UI
	Description string `json:"description" form:"description"`
	// List of particle effects which are part of this preset
	ParticleEffects []ParticleEffect `json:"particleEffects" form:"effect"`

	// UI specific models
	UIAllowedParticleEffects []string       `json:"-" form:"-"`
	UIAllowedRegionTypes     []UIRegionType `json:"-" form:"-"`
}

// ParticleEffect contains information on the effect and where to display it
type ParticleEffect struct {
	// Minecraft name of the particle effect
	Name string `json:"name" form:"name"`
	// Region information on where and how to display the effect
	Region Region `json:"region" form:"-"`

	// UI specific models
	UIRegionPointIDs   string `json:"-" form:"pointIds"`
	UIRegionRegionType string `json:"-" form:"regionType"`
	UIRegionRandomize  bool   `json:"-" form:"randomize"`
	UIRegionDensity    int    `json:"-" form:"density"`
	UIRegionEquation   string `json:"-" form:"equation"`
}

// Region contains information on where and how to display the particle effect
type Region struct {
	// List of predefined points in the Minecraft world
	PointIDs []int `json:"pointIds"`
	// Type of the region the effect is to be displayed in
	RegionType string `json:"type"`
	// Whether or not to randomize placement of particles within the region [for CuboidRegionType]
	Randomize bool `json:"randomize,omitempty"`
	// Density of the particles [for CuboidRegionType]
	Density float64 `json:"density,omitempty"`
	// Equation for the shape of the effect region [for EquationRegionTyp]e
	Equation string `json:"equation,omitempty"`
}

// UIRegionType is used for displaying region type options on the UI
type UIRegionType struct {
	Name        string
	Description string
}

// RegionTypes is a list of all supported region types
var RegionTypes = []UIRegionType{
	UIRegionType{
		Name:        "POINTS",
		Description: "One particle at each specified point",
	},
	UIRegionType{
		Name:        "CUBOID",
		Description: "Inside a cuboid specified by two points",
	},
	UIRegionType{
		Name:        "EQUATION",
		Description: "In a shape described by an equation around one point",
	},
}

// MinecraftParticleEffects is a list of all supported Minecraft particle effects
var MinecraftParticleEffects = []string{
	"BARRIER",
	"BLOCK_CRACK",
	"BLOCK_DUST",
	"BUBBLE_COLUMN_UP",
	"BUBBLE_POP",
	"CAMPFIRE_COSY_SMOKE",
	"CAMPFIRE_SIGNAL_SMOKE",
	"CLOUD",
	"COMPOSTER",
	"CRIT",
	"CRIT_MAGIC",
	"CURRENT_DOWN",
	"DAMAGE_INDICATOR",
	"DOLPHIN",
	"DRAGON_BREATH",
	"DRIP_LAVA",
	"DRIP_WATER",
	"DRIPPING_HONEY",
	"ENCHANTMENT_TABLE",
	"END_ROD",
	"EXPLOSION_HUGE",
	"EXPLOSION_LARGE",
	"EXPLOSION_NORMAL",
	"FALLING_DUST",
	"FALLING_HONEY",
	"FALLING_LAVA",
	"FALLING_NECTAR",
	"FALLING_WATER",
	"FIREWORKS_SPARK",
	"FLAME",
	"FLASH",
	"HEART",
	"ITEM_CRACK",
	"LANDING_HONEY",
	"LANDING_LAVA",
	"LAVA",
	"MOB_APPEARANCE",
	"NAUTILUS",
	"NOTE",
	"PORTAL",
	"REDSTONE",
	"SLIME",
	"SMOKE_LARGE",
	"SMOKE_NORMAL",
	"SNEEZE",
	"SNOW_SHOVEL",
	"SNOWBALL",
	"SPELL",
	"SPELL_INSTANT",
	"SPELL_MOB",
	"SPELL_MOB_AMBIENT",
	"SPELL_WITCH",
	"SPIT",
	"SQUID_INK",
	"SUSPENDED",
	"SUSPENDED_DEPTH",
	"SWEEP_ATTACK",
	"TOTEM",
	"TOWN_AURA",
	"VILLAGER_ANGRY",
	"VILLAGER_HAPPY",
	"WATER_BUBBLE",
	"WATER_DROP",
	"WATER_SPLASH",
	"WATER_WAKE",
}
