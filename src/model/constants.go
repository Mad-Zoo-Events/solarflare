package model

// EffectType represents the type of visual effect
type EffectType string

const (
	// EffectTypeParticleEffect represents a particle effect
	EffectTypeParticleEffect = EffectType("particle")
	// EffectTypeDragon represents the dragon effect
	EffectTypeDragon = EffectType("dragon")
)

// Action represents the action to be performed on the visual effect (e.g. start, stop, restart...)
type Action string

const (
	// TriggerEffectAction triggers a visual effect
	TriggerEffectAction = Action("trigger")
	// StartEffectAction starts a visual effect
	StartEffectAction = Action("start")
	// RestartEffectAction restarts a visual effect
	RestartEffectAction = Action("restart")
	// StopEffectAction stops a visual effect
	StopEffectAction = Action("stop")
)

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
