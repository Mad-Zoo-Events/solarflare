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
	{
		Name:        "BLINDNESS",
		Description: "Blinds an entity",
	},
	{
		Name:        "DOLPHINS_GRACE",
		Description: "Squee'ek uh'k kk'kkkk squeek eee'eek",
	},
	{
		Name:        "GLOWING",
		Description: "Outlines the entity so that it can be seen from afar",
	},
	{
		Name:        "INVISIBILITY",
		Description: "Grants invisibility",
	},
	{
		Name:        "JUMP",
		Description: "(= jump_boost) Increases jump height",
	},
	{
		Name:        "LEVITATION",
		Description: "Causes the entity to float into the air",
	},
	{
		Name:        "CONFUSION",
		Description: "(= nausea) Warps vision on the client",
	},
	{
		Name:        "NIGHT_VISION",
		Description: "Allows an entity to see in the dark",
	},
	{
		Name:        "DAMAGE_RESISTANCE",
		Description: "(= resistance) Decreases damage dealt to an entity",
	},
	{
		Name:        "SLOW_FALLING",
		Description: "Slows entity fall rate",
	},
	{
		Name:        "SLOW",
		Description: "(= slowness) Decreases movement speed",
	},
	{
		Name:        "SPEED",
		Description: "Increases movement speed",
	},
	{
		Name:        "WATER_BREATHING",
		Description: "Allows breathing underwater",
	},
}
