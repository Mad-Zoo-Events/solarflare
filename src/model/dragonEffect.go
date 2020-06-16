package model

// DragonEffectPreset is the request model for particle effects
type DragonEffectPreset struct {
	// Unique identifier of the preset
	ID string `json:"id" form:"id"`
	// Display name for the UI
	DisplayName string `json:"displayName" form:"displayName"`
	// Description of the preset for the UI
	Description string `json:"description" form:"description"`
	// List of dragon effects which are part of this preset
	DragonEffects []DragonEffect `json:"dragonEffects" form:"effect"`
}

// DragonEffect contains information on where and how to display the dragon effect
type DragonEffect struct {
	// Predefined point where the dragon should be displayed in the world
	PointID int `json:"pointId" form:"pointId"`
	// Defines whether or not the dragon should remain where it is or continuously float up
	Static bool `json:"static" form:"static"`
}
