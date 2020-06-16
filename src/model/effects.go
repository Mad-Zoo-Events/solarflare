package model

// ParticleEffectPreset describes a particle effect preset
type ParticleEffectPreset struct {
	// Unique identifier of the preset
	ID string `json:"id" form:"id"`
	// Display name for the UI
	DisplayName string `json:"displayName" form:"displayName"`
	// Description of the preset for the UI
	Description string `json:"description" form:"description"`
	// List of particle effects which are part of this preset
	ParticleEffects []ParticleEffect `json:"particleEffects" form:"effect"`

	// UI specific models
	UIAllowedParticleEffects []string       `json:"-" form:"-"`
	UIAllowedRegionTypes     []UIRegionType `json:"-" form:"-"`
}

// UIRegionType is used for displaying region type options on the UI
type UIRegionType struct {
	Name        string
	Description string
}

// ParticleEffect contains information on the effect and where to display it
type ParticleEffect struct {
	// Minecraft name of the particle effect
	Name string `json:"name" form:"name"`
	// Region information on where and how to display the effect
	Region Region `json:"region" form:"-"`

	// UI specific models
	UIRegionPointIDs   string `json:"-" form:"pointIds"`
	UIRegionRegionType string `json:"-" form:"regionType"`
	UIRegionRandomize  bool   `json:"-" form:"randomize"`
	UIRegionDensity    int    `json:"-" form:"density"`
	UIRegionEquation   string `json:"-" form:"equation"`
}

// Region contains information on where and how to display the particle effect
type Region struct {
	// List of predefined points in the Minecraft world
	PointIDs []int `json:"pointIds"`
	// Type of the region the effect is to be displayed in
	RegionType string `json:"type"`
	// Whether or not to randomize placement of particles within the region [for CuboidRegionType]
	Randomize bool `json:"randomize,omitempty"`
	// Density of the particles [for CuboidRegionType]
	Density float64 `json:"density,omitempty"`
	// Equation for the shape of the effect region [for EquationRegionTyp]e
	Equation string `json:"equation,omitempty"`
}

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
