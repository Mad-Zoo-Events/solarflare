package model

// PotionEffectPreset is the request model for potion effects
type PotionEffectPreset struct {
	ID            string         `json:"id" form:"id"`
	DisplayName   string         `json:"displayName" form:"displayName"`
	Description   string         `json:"description" form:"description"`
	KeyBinding    rune           `json:"keyBinding" form:"keyBinding"`
	PotionEffects []PotionEffect `json:"potionEffects" form:"effect"`

	// UI specific models
	UIKeyBinding           string               `json:"-" form:"-"`
	UIAllowedPotionEffects []UIPotionEffectType `json:"-" form:"-"`
}

// PotionEffect defines which effect to apply with which amplifier
type PotionEffect struct {
	// Minecraft name of the potion effect
	Type string `json:"type" form:"type"`
	// Sets the amplifier for the potion effect if supported
	Amplifier int `json:"amplifier" form:"amplifier"`
}

// UIPotionEffectType is used for displaying potion effect type options on the UI
type UIPotionEffectType struct {
	Name        string
	Description string
}

// MinecraftPotionEffects is a list of all supported Minecraft potion effects
var MinecraftPotionEffects = []UIPotionEffectType{
	UIPotionEffectType{
		Name:        "BLINDNESS",
		Description: "Blinds an entity",
	},
	UIPotionEffectType{
		Name:        "DOLPHINS_GRACE",
		Description: "Squee'ek uh'k kk'kkkk squeek eee'eek",
	},
	UIPotionEffectType{
		Name:        "GLOWING",
		Description: "Outlines the entity so that it can be seen from afar",
	},
	UIPotionEffectType{
		Name:        "INVISIBILITY",
		Description: "Grants invisibility",
	},
	UIPotionEffectType{
		Name:        "JUMP",
		Description: "(= jump_boost) Increases jump height",
	},
	UIPotionEffectType{
		Name:        "LEVITATION",
		Description: "Causes the entity to float into the air",
	},
	UIPotionEffectType{
		Name:        "CONFUSION",
		Description: "(= nausea) Warps vision on the client",
	},
	UIPotionEffectType{
		Name:        "NIGHT_VISION",
		Description: "Allows an entity to see in the dark",
	},
	UIPotionEffectType{
		Name:        "DAMAGE_RESISTANCE",
		Description: "(= resistance) Decreases damage dealt to an entity",
	},
	UIPotionEffectType{
		Name:        "SLOW_FALLING",
		Description: "Slows entity fall rate",
	},
	UIPotionEffectType{
		Name:        "SLOW",
		Description: "(= slowness) Decreases movement speed",
	},
	UIPotionEffectType{
		Name:        "SPEED",
		Description: "Increases movement speed",
	},
	UIPotionEffectType{
		Name:        "WATER_BREATHING",
		Description: "Allows breathing underwater",
	},
}
