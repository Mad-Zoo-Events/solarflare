package model

// ControlPanel holds all data to be rendered on the control panel website
type ControlPanel struct {
	ParticleEffectPresets []ParticleEffectPreset
	DragonEffectPresets   []DragonEffectPreset

	RegisteredServerCount int
}

// Server contains information about aN eyecandy plugin server
type Server struct {
	Address string
}

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
