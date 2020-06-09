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
}
