package model

// PotionEffectPreset is the request model for particle effects
type PotionEffectPreset struct {
	ID            string         `json:"id" form:"id"`
	DisplayName   string         `json:"displayName" form:"displayName"`
	Description   string         `json:"description" form:"description"`
	PotionEffects []PotionEffect `json:"potionEffects" form:"effect"`
}

// PotionEffect defines which effect to apply with which amplifier
type PotionEffect struct {
	// Minecraft name of the potion effect
	Type int `json:"type" form:"type"`
	// Sets the amplifier for the potion effect if supported
	Amplifier bool `json:"amplifier" form:"amplifier"`
}
