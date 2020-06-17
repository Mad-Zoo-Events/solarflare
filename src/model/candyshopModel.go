package model

// ================ INTERNAL MODELS ================ //

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	ParticleEffectPresets  []ParticleEffectPreset
	DragonEffectPresets    []DragonEffectPreset
	TimeshiftEffectPresets []TimeshiftEffectPreset

	RegisteredServerCount int
}

// Server contains information about aN eyecandy plugin server
type Server struct {
	Address string
}

// EffectType represents the type of visual effect
type EffectType string

const (
	// EffectTypeParticle represents a particle effect
	EffectTypeParticle = EffectType("particle")
	// EffectTypeDragon represents the dragon effect
	EffectTypeDragon = EffectType("dragon")
	// EffectTypeTimeshift represents the timeshift effect
	EffectTypeTimeshift = EffectType("time")
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

// ================ RESPONSE MODELS ================ //

// StatusResponse returns information on the service and the plugin network to the consumer
type StatusResponse struct {
	RegisteredServerCount int `json:"registeredServerCount"`
}

// Error returns an error
type Error struct {
	// code
	Code int64 `json:"code"`
	// message
	Message string `json:"message"`
}
