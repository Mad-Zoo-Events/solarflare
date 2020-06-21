package model

// PotionEffectPreset is the request model for potion effects
type PotionEffectPreset struct {
	ID            string         `json:"id" form:"id"`
	DisplayName   string         `json:"displayName" form:"displayName"`
	Description   string         `json:"description" form:"description"`
	PotionEffects []PotionEffect `json:"potionEffects" form:"effect"`

	// UI specific models
	UIAllowedPotionEffects map[string]string `json:"-" form:"-"`
}

// PotionEffect defines which effect to apply with which amplifier
type PotionEffect struct {
	// Minecraft name of the potion effect
	Type string `json:"type" form:"type"`
	// Sets the amplifier for the potion effect if supported
	Amplifier int `json:"amplifier" form:"amplifier"`
}

// MinecraftPotionEffects is a list of all supported Minecraft potion effects
var MinecraftPotionEffects = map[string]string{
	// "absorption":          "Adds yellow Absorption health hearts",
	// "unluck":              "Decreases the chances of getting valuable loot",
	// "bad_omen":            "Causes a group of hostile mobs to attack when a player with Bad Omen enters a village",
	"blindness":      "Creates a thick black fog",
	"conduit_power":  "Improves visibility and mining speed underwater, and adds ability to breathe underwater",
	"dolphins_grace": "Increases swimming speed",
	// "fire_resistance":     "Immunity to fire, lava, and direct hits from fire balls",
	"glowing": "Shows a bright white outline around the player or mob that can be seen through solid objects",
	// "haste":               "Speeds up how fast you break blocks",
	// "health_boost":        "Adds additional hearts to your base health",
	// "hero_of_the_village": "Receive discounted trades from villagers after completing a Raid",
	// "hunger":              "Depletes food meter",
	// "instant_damage":      "Damages instantly",
	// "instant_health":      "Heals instantly",
	"invisibility": "Invisible to others",
	"jump_boost":   "Jump higher",
	"levitation":   "Player will involuntarily float upwards into the sky and continue to rise",
	// "luck":                "Increases the chances of getting valuable loot",
	// "mining_fatigue":      "Slows down how fast you break blocks",
	"nausea":       "Wobbles and warps what you see in the game",
	"night_vision": "Increases brightness level to 15 (see better in dark)",
	// "poison":              "Does damage every 1.25 seconds (can not kill player)",
	// "regeneration":        "Restores half heart every 2.5 seconds",
	"resistance": "Reduces all damage",
	// "saturation":          "Replenishes food meter",
	"slow_falling": "Slows down how fast you fall and eliminates fall damage",
	"slowness":     "Decreases speed",
	"speed":        "Increases speed",
	// "strength":            "Increases attack damage (melee attacks)",
	"water_breathing": "Breathe underwater without using up oxygen bar",
	// "weakness":            "Decreases attack damage (melee attacks)",
	// "wither":              "Does damage every 2 seconds (can kill player)",
}
