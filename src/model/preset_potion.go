package model

// PotionEffectPreset is the domain and request/response model for potion effects
type PotionEffectPreset struct {
	Preset

	PotionEffects []PotionEffect `json:"potionEffects"`
}

// PotionEffect defines which effect to apply with which amplifier
type PotionEffect struct {
	// Minecraft name of the potion effect
	Type string `json:"type"`
	// Sets the amplifier for the potion effect if supported
	Amplifier int `json:"amplifier"`
}
