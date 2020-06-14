package model

// EffectType represents the type of visual effect
type EffectType string

const (
	// EffectTypeParticleEffect represents a particle effect
	EffectTypeParticleEffect = EffectType("particle")
	// EffectTypeDragon represents the dragon effect
	EffectTypeDragon = EffectType("dragon")
)

// Action represents the action to be performed on the visual effect (e.g. start, stop, restart...)
type Action string

const (
	// TriggerEffectAction triggers a visual effect
	TriggerEffectAction = Action("trigger")
	// StartEffectAction starts a visual effect
	StartEffectAction = Action("start")
	// RestartEffectAction restarts a visual effect
	RestartEffectAction = Action("restart")
	// StopEffectAction stops a visual effect
	StopEffectAction = Action("stop")
)

// RegionType represents the regional display type for particle effects
type RegionType string

const (
	// PointsRegionType defines a region as a list of points
	PointsRegionType = RegionType("POINTS")
	// CuboidRegionType defines a cuboid filled with particles at a specified density
	CuboidRegionType = RegionType("CUBOID")
	// EquationRegionType defines a shape described by a mathematical equation
	EquationRegionType = RegionType("EQUATION")
)

// ParticleEffectPreset describes a particle effect preset
type ParticleEffectPreset struct {
	// Unique identifier of the preset
	ID string
	// Display name for the UI
	DisplayName string
	// List of particle effects which are part of this preset
	ParticleEffects []ParticleEffect
}

// ParticleEffect contains information on the effect and where to display it
type ParticleEffect struct {
	// Minecraft name of the particle effect
	Name string `json:"name"`
	// Region information on where and how to display the effect
	Region Region `json:"region"`
}

// Region contains information on where and how to display the particle effect
type Region struct {
	// List of predefined points in the Minecraft world
	PointIDs []int `json:"pointIds"`
	// Type of the region the effect is to be displayed in
	RegionType RegionType `json:"type"`
	// Density of the particles for CuboidRegionType
	Density *float32 `json:"density,omitempty"`
	// Equation for the shape of the effect region for EquationRegionType
	Equation *string `json:"equation,omitempty"`
}

// DragonEffectPreset is the request model for particle effects
type DragonEffectPreset struct {
	// Unique identifier of the preset
	ID string
	// Display name for the UI
	DisplayName string
	// List of dragon effects which are part of this preset
	DragonEffects []DragonEffect
}

// DragonEffect contains information on where and how to display the dragon effect
type DragonEffect struct {
	// Predefined point where the dragon should be displayed in the world
	PointID int `json:"pointId"`
	// Defines whether or not the dragon should remain where it is or continuously float up
	Static bool `json:"static"`
}
