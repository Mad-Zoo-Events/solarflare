package model

// ParticleEffectControl contains information about particle effect
type ParticleEffectControl struct {
	Name        string
	DisplayName string
}

// DragonControl contains information about the dragon effect
type DragonControl struct {
	DisplayName string
}

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	ParticleEffects []ParticleEffectControl
	Dragon          DragonControl
	// Lasers []LaserControl

	RegisteredServerCount int
}

// Server contains information about aN eyecandy plugin server
type Server struct {
	Address string
}

// ================ REQUEST MODELS ================ //

// InboundParticleEffectRequest is the model for particle effect requests coming from the frontend
type InboundParticleEffectRequest struct {
	EffectName string
	Action     string
}

// InboundDragonRequest is the model for dragon requests coming from the frontend
type InboundDragonRequest struct {
	Action string
	Static bool
}

// ================ RESPONSE MODELS ================ //

// InboundStatusResponse returns information on the service and the plugin network to the consumer
type InboundStatusResponse struct {
	RegisteredServerCount int
}
