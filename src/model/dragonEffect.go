package model

// DragonEffectPreset is the request model for particle effects
type DragonEffectPreset struct {
	ID            string         `json:"id" form:"id"`
	DisplayName   string         `json:"displayName" form:"displayName"`
	Description   string         `json:"description" form:"description"`
	DragonEffects []DragonEffect `json:"dragonEffects" form:"effect"`
}

// DragonEffect contains information on where and how to display the dragon effect
type DragonEffect struct {
	// Predefined point where the dragon should be displayed in the world
	PointID int `json:"pointId" form:"pointId"`
	// Defines whether or not the dragon should remain where it is or continuously float up
	Static bool `json:"static" form:"static"`
}
