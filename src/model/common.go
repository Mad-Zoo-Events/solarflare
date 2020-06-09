package model

// VisualType represents the type of visual effect
type VisualType string

const (
	// VisualTypeParticleEffect represents a particle effect
	VisualTypeParticleEffect = VisualType("particle")
	// VisualTypeDragon represents the dragon effect
	VisualTypeDragon = VisualType("dragon")
)

// Point is a representation of a coordinate in Minecraft
type Point struct {
	ID int
	X  *float32
	Y  *float32
	Z  *float32
}
