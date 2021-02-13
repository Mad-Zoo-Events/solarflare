package model

// DragonEffectPreset is the domain and request/response model for particle effects
type DragonEffectPreset struct {
	Preset

	DragonEffects []DragonEffect `json:"dragonEffects"`
}

// DragonEffect contains information on where and how to display the dragon effect
type DragonEffect struct {
	// Predefined point where the dragon should be displayed in the world
	PointID int `json:"pointId"`
	// Defines whether or not the dragon should remain where it is or continuously float up
	Static bool `json:"static"`
}
