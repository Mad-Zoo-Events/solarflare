package model

// EffectType represents the type of visual effect
type EffectType string

const (
	// EffectTypeParticleEffect represents a particle effect
	EffectTypeParticleEffect = EffectType("particle")
	// EffectTypeDragon represents the dragon effect
	EffectTypeDragon = EffectType("dragon")
)

// Point is a representation of a coordinate in Minecraft
type Point struct {
	ID int
	X  *float32
	Y  *float32
	Z  *float32
}
