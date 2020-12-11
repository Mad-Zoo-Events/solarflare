package model

// LaserEffectPreset is the request model for the laser effects
type LaserEffectPreset struct {
	ID          string `json:"id"`
	DisplayName string `json:"displayName"`
	Description string `json:"description"`
	KeyBinding  rune   `json:"keyBinding"`

	IsEndLaser           bool          `json:"isEndLaser"`
	IsNonPlayerTargeting bool          `json:"isNonPlayerTargeting"`
	LaserType            LaserType     `json:"laserType"`
	LaserEffects         []LaserEffect `json:"laserEffects"`
}

// LaserEffect contains information on start and potential end point of the laser
// If only the origin point is specified, the laser will be a player-targeting laser
// originating from that point.
// If a destination point is specified as well, the laser will connect the two points.
type LaserEffect struct {
	// Predefined point where the laser originates
	StartPointID int `json:"start"`
	// Predefined point where the laser goes to, if specified
	EndPointID *int `json:"end"`
}

// LaserType represents the type of laser associated with an effect
type LaserType string

const (
	// EndLaserType represents the end crystal laser connecting the start and end point
	EndLaserType = LaserType("end")
	// NonTargetingGuardianLaserType represents the guardian laser connecting the start and end point
	NonTargetingGuardianLaserType = LaserType("nonTargetingGuardian")
	// TargetingGuardianLaserType represents the guardian laser which is targeting a player from the start point
	TargetingGuardianLaserType = LaserType("targetingGuardian")
)
