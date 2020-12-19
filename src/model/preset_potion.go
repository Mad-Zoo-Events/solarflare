package model

// PotionEffectPreset is the request model for potion effects
type PotionEffectPreset struct {
	ID           string        `json:"id"`
	DisplayName  string        `json:"displayName"`
	Description  string        `json:"description"`
	KeyBinding   rune          `json:"keyBinding"`
	MIDIMappings []MIDIMapping `json:"midiMappings"`

	PotionEffects []PotionEffect `json:"potionEffects"`
}

// PotionEffect defines which effect to apply with which amplifier
type PotionEffect struct {
	// Minecraft name of the potion effect
	Type string `json:"type"`
	// Sets the amplifier for the potion effect if supported
	Amplifier int `json:"amplifier"`
}
