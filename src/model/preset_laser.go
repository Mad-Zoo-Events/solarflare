package model

// LaserEffectPreset is the request model for the laser effects
type LaserEffectPreset struct {
	ID          string `json:"id" form:"id"`
	DisplayName string `json:"displayName" form:"displayName"`
	Description string `json:"description" form:"description"`
	KeyBinding  rune   `json:"keyBinding" form:"keyBinding"`

	IsEndLaser           bool          `json:"isEndLaser" form:"isEndLaser"`
	IsNonPlayerTargeting bool          `json:"isNonPlayerTargeting" form:"isNonPlayerTargeting"`
	LaserEffects         []LaserEffect `json:"laserEffects" form:"effect"`

	// UI specific models
	UIKeyBinding string `json:"-" form:"-"`
}

// LaserEffect contains information on start and potential end point of the laser
// If only the origin point is specified, the laser will be a player-targeting laser
// originating from that point.
// If a destination point is specified as well, the laser will connect the two points.
type LaserEffect struct {
	// Predefined point where the laser originates
	StartPointID int `json:"start" form:"startPointId"`
	// Predefined point where the laser goes to, if specified
	EndPointID *int `json:"end" form:"endPointId"`
}
