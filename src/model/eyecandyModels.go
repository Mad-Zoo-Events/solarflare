package model

// Action represents the action to be performed on the visual effect (e.g. start, stop, restart...)
type Action string

const (
	// TriggerEffectAction triggers a visual effect
	TriggerEffectAction = Action("TRIGGER")
	// StartEffectAction starts a visual effect
	StartEffectAction = Action("START")
	// RestartEffectAction restarts a visual effect
	RestartEffectAction = Action("RESTART")
	// StopEffectAction stops a visual effect
	StopEffectAction = Action("STOP")
)

// ParticleEffectRequest is the request model for particle effects
type ParticleEffectRequest struct {
	Name     string
	Action   Action
	PointIDs []int
}

// DragonRequest is the request model for the dragon effect
type DragonRequest struct {
	Action  Action
	PointID int
	Static  *bool
}
